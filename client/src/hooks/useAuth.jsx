import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginUser, registerUser, logoutUser } from "@/services/authServices";
import { fetchCurrentUser } from "@/services/userServices";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

// Zustand store for persisting auth state

// React Query hook for auth operations
export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const clearAuthState = () => {
    localStorage.removeItem("isAuthenticated");
    queryClient.clear();
    axiosInstance.defaults.headers.common["Authorization"] = "";
  };

  const updateAuthState = (isAuthenticated) => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  };

  const getAuthState = () => {
    try {
      const stored = localStorage.getItem("isAuthenticated");
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error("Error parsing auth state:", error);
      localStorage.removeItem("isAuthenticated");
      return false;
    }
  };

  const isAuthenticated = getAuthState();
  
  console.log("useAuth - isAuthenticated from localStorage:", isAuthenticated);

  const {
    isLoading: queryLoading,
    error,
    data,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated === true,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
    gcTime: 1000 * 60 * 30, // Cache for 30 minutes
    staleTime: 1000 * 60 * 15, // Consider stale after 15 minutes
  });

  // Only show loading if authenticated AND query is actually loading
  const isLoading = isAuthenticated === true && queryLoading;

  console.log("useAuth - query state:", { isLoading, error: error?.message, hasData: !!data?.user });

  // Handle success and error cases with useEffect
  useEffect(() => {
    if (data?.user && !error) {
      console.log("useAuth - User data received:", data.user);
      updateAuthState(true);
    }
  }, [data, error]);

  useEffect(() => {
    if (error) {
      console.log("useAuth - Error fetching user:", error.message);
      if (error?.response?.status === 401) {
        clearAuthState();
        toast.error("Session expired. Please log in again.");
      }
    }
  }, [error]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    if (isAuthenticated && isLoading) {
      const timeout = setTimeout(() => {
        console.log("useAuth - Loading timeout, clearing auth state");
        clearAuthState();
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, isLoading]);

  /* useEffect(() => {
    if (isAuthenticated && data.user && !isLoading) {
      navigate(`/dashboard/${data.user?.role}`);
    }
  }, [isAuthenticated]); */

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      updateAuthState(true);
    },
    onError: (error) => {
      updateAuthState(false);
      console.log(error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success(
        "Successfully registered! Check your email to verify your account."
      );
    },
    onError: (error) => toast.error(`Registration Error: ${error.message}`),
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuthState();
      queryClient.removeQueries(["currentUser"]); // Remove the currentUser query from the cache
      navigate("/");
    },
    onError: (error) => {
      toast.error("Logout failed! retry");
      console.error("Logout error:", error);
      // Even if logout fails on the server, clear local state
      /*  setIsAuthenticated(false);
      queryClient.clear();
      axiosInstance.defaults.headers.common["Authorization"] = "";
      navigate("/login"); */
    },
  });

  const roleMap = {
    jobSeeker: "teacher",
    recruiter: "school",
  };

  const currentRole = data?.user?.role;
  const effectiveRole = roleMap[currentRole] || currentRole;
  
  console.log("useAuth - Role mapping:", { currentRole, effectiveRole });

  return {
    user: data?.user ? { ...data.user, role: effectiveRole } : null,
    isLoading,
    error,
    isAuthenticated: getAuthState(),
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    refetchUser,
  };
};
