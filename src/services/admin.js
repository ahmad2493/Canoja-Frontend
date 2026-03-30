import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";

// Token helpers
export { setToken, getToken, removeToken, setRefreshToken, getRefreshToken, removeRefreshToken } from "./api";

// Admin Authentication
const adminLogin = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};

// Get all users (admin only)
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
  });
};

// Pending Verification Requests
export const fetchPendingVerificationRequests = async () => {
  try {
    const response = await api.get("/verification-requests/admin/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch pending requests");
  }
};

export const usePendingVerificationRequests = () => {
  return useQuery({
    queryKey: ["pendingVerificationRequests"],
    queryFn: fetchPendingVerificationRequests,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Approve Verification Request
export const approveVerificationRequest = async (requestId) => {
  try {
    const response = await api.post(`/verification-requests/${requestId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error approving request:", error);
    throw new Error(error.response?.data?.message || "Failed to approve request");
  }
};

export const useApproveVerificationRequest = () => {
  return useMutation({
    mutationFn: approveVerificationRequest,
  });
};

// Reject Verification Request
export const rejectVerificationRequest = async ({ requestId, reason }) => {
  try {
    const response = await api.post(`/verification-requests/${requestId}/reject`, {
      reason: reason || "No reason provided"
    });
    return response.data;
  } catch (error) {
    console.error("Error rejecting request:", error);
    throw new Error(error.response?.data?.message || "Failed to reject request");
  }
};

export const useRejectVerificationRequest = () => {
  return useMutation({
    mutationFn: rejectVerificationRequest,
  });
};

// Change Password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post("/users/change-password", passwordData);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(error.response?.data?.error || "Failed to change password");
  }
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

// Forgot Password - Request OTP
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw new Error(error.response?.data?.error || "Failed to request password reset");
  }
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
  });
};

// Verify OTP only
export const verifyOTP = async ({ email, otp }) => {
  try {
    const response = await api.post("/users/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error(error.response?.data?.error || "Failed to verify OTP");
  }
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,
  });
};

// Reset Password - Verify OTP and set new password
export const resetPassword = async ({ email, otp, newPassword }) => {
  try {
    const response = await api.post("/users/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error(error.response?.data?.error || "Failed to reset password");
  }
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};