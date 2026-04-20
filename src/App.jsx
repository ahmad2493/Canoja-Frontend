import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/Login";
import AdminVerificationDashboard from "./components/AdminVerificationDashboard";
import AdminVerificationRequests from "./components/AdminVerificationRequests";
import AdminHistory from "./components/AdminHistory";
import AdminUsers from "./components/AdminUsers";
import OperatorDashboard from "./components/OperatorDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopFinder from "./components/ShopFinder";
import ClaimBusinessForm from "./components/ClaimBusinessForm";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOTP from "./components/VerifyOTP";
import AdminRetailers from "./components/admin/AdminRetailers";
import AdminPendingVerifications from "./components/admin/AdminPendingVerifications";
import AdminPendingRequests from "./components/admin/AdminPendingRequests";
import AdminCanojaVerified from "./components/admin/AdminCanojaVerified";
import AdminVerifiedPharmacies from "./components/admin/AdminVerifiedPharmacies";

// Create QueryClient with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div style={{ minHeight: "100vh" }}>
          <Routes>
            {/* General Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Redirect old admin login route to general login */}
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />

            {/* Forgot Password Flow */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Claim Business Form - Public */}
            <Route 
              path="/claim-business" 
              element={<ClaimBusinessForm />} 
            />

            {/* Admin Routes - Protected */}
            <Route path="/admin/dashboard" element={<Navigate to="/admin/retailers" replace />} />
            <Route
              path="/admin/retailers"
              element={<ProtectedRoute><AdminRetailers /></ProtectedRoute>}
            />
            <Route
              path="/admin/pending-verifications"
              element={<ProtectedRoute><AdminPendingVerifications /></ProtectedRoute>}
            />
            <Route
              path="/admin/pending-requests"
              element={<ProtectedRoute><AdminPendingRequests /></ProtectedRoute>}
            />
            <Route
              path="/admin/canoja-verified"
              element={<ProtectedRoute><AdminCanojaVerified /></ProtectedRoute>}
            />
            <Route
              path="/admin/verified-pharmacies"
              element={<ProtectedRoute><AdminVerifiedPharmacies /></ProtectedRoute>}
            />
            <Route
              path="/admin/verification-requests"
              element={<ProtectedRoute><AdminVerificationRequests /></ProtectedRoute>}
            />

            {/* Operator Dashboard - Protected */}
            <Route 
              path="/operator/dashboard" 
              element={
                <ProtectedRoute>
                  <OperatorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Redirects */}
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          
          {/* Global Toast Notifications */}
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;