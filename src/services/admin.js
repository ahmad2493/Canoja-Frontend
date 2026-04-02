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
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Login failed");
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
export const fetchPendingVerificationRequests = async (businessType = "") => {
  try {
    const params = businessType ? { business_type: businessType } : {};
    const response = await api.get("/verification-requests/admin/pending", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch pending requests");
  }
};

export const usePendingVerificationRequests = (businessType = "") => {
  return useQuery({
    queryKey: ["pendingVerificationRequests", businessType],
    queryFn: () => fetchPendingVerificationRequests(businessType),
    refetchInterval: 30000,
  });
};

// Verification History
export const fetchVerificationHistory = async ({ status = "", businessType = "", page = 1, limit = 50 } = {}) => {
  try {
    const params = { page, limit };
    if (status) params.status = status;
    if (businessType) params.business_type = businessType;
    const response = await api.get("/admin/verification-history", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching verification history:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch verification history");
  }
};

export const useVerificationHistory = ({ status = "", businessType = "", page = 1, limit = 50 } = {}) => {
  return useQuery({
    queryKey: ["verificationHistory", status, businessType, page, limit],
    queryFn: () => fetchVerificationHistory({ status, businessType, page, limit }),
  });
};

// Toggle User Active Status
export const toggleUserStatus = async (userId) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw new Error(error.response?.data?.error || "Failed to update user status");
  }
};

export const useToggleUserStatus = () => {
  return useMutation({
    mutationFn: toggleUserStatus,
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