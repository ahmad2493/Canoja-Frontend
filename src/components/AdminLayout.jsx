// Update AdminLayout.jsx to use AuthContext
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ChangePasswordModal from "./ChangePasswordModal";
import api from "../services/api";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const queryClient = useQueryClient();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Call backend logout to clear refresh token from DB
      await api.post("/users/logout").catch(() => {});

      // Clear React Query cache
      queryClient.clear();

      // Call AuthContext logout (removes tokens + updates state)
      logout();

      // Show success message
      toast.success("Logged out successfully");

      // Redirect to login page
      navigate("/login");

    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");

      // Force cleanup anyway
      logout();
      navigate("/login");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      width: "100%",
    }}>
      <AdminHeader onLogout={handleLogout} />
      <div style={{
        display: "flex",
        maxWidth: "1280px",
        margin: "0 auto",
        minHeight: "calc(100vh - 72px)",
      }}>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onChangePassword={() => setShowChangePassword(true)}
        />

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
        }}>
          {children}
        </main>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;