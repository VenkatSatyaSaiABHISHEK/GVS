import { refreshToken } from "@/services/authServices";
import axios from "axios";

// Use relative URL so requests go through the Vite proxy (same-origin).
// This avoids cross-origin cookie issues between localhost:3000 ↔ localhost:8000.
// In production, VITE_API_URL can be set and will be used directly.
const API_URL = import.meta.env.VITE_API_URL;
const BASE = import.meta.env.PROD ? `${API_URL}/api` : "/api";

// Track refresh token attempts per request
const MAX_REFRESH_ATTEMPTS = 3;
const refreshAttemptTracker = new Map();

const clearAuthAndRedirect = () => {
  localStorage.removeItem("isAuthenticated");

  document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(
      /^.*?=/,
      "=;expires=" + new Date().toUTCString() + ";path=/"
    );
  });

  // Only redirect if we're not already on a public auth page
  const authPages = ["/", "/login", "/register"];
  const isOnAuthPage = authPages.some(p => window.location.pathname === p);
  if (!isOnAuthPage) {
    window.location.href = "/login";
  }
};

// List of paths that don't require authentication
const publicPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  // Add any other public paths here
];

const isPublicPath = (url) => {
  return publicPaths.some((path) => url?.includes(path));
};

const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Always allow public paths without authentication check
    if (isPublicPath(config.url)) {
      return config;
    }

    // For protected routes, check if we have authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated || isAuthenticated === "false") {
      // Don't reject - let the server handle it and return proper 401
      // This allows the response interceptor to handle token refresh
      console.warn("Request to protected route without authentication");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;

    // Skip if this is a public path
    if (isPublicPath(originalRequest?.url)) {
      return Promise.reject(error);
    }

    // Only attempt refresh token if we get a 401 and have authentication
    if (error?.response?.status === 401 && !originalRequest?._retry) {
      const requestId = `${originalRequest.method}-${originalRequest.url}`;
      const currentAttempts = refreshAttemptTracker.get(requestId) || 0;

      if (currentAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.error("Max refresh attempts reached for request:", requestId);
        refreshAttemptTracker.delete(requestId);
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const isAllowed = JSON.parse(localStorage.getItem("isAuthenticated"));

        if (isAllowed) {
          refreshAttemptTracker.set(requestId, currentAttempts + 1);

          const { accessToken } = await refreshToken();
          if (!accessToken) {
            throw new Error("No access token received");
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        // Only clear and redirect if we're certain the refresh failed
        if (
          err.response?.status === 401 ||
          err.message === "No access token received"
        ) {
          clearAuthAndRedirect();
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Add a method to reset the refresh attempts counter
axiosInstance.resetRefreshAttempts = () => {
  refreshAttemptTracker.clear();
};

export default axiosInstance;
