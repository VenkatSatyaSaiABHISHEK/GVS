import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Add global error handler for debugging blank page issues
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global error:", message, source, lineno, colno, error);
  const root = document.getElementById("root");
  if (root && !root.innerHTML.trim()) {
    root.innerHTML = `<div style="padding: 20px; font-family: sans-serif; background: #fee; margin: 20px; border-radius: 8px;">
      <h2 style="color: #c00;">Application Error</h2>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
      <p>Please check the browser console (F12) for details.</p>
    </div>`;
  }
  return false;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);