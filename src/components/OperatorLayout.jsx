import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import OperatorHeader from "./OperatorHeader";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext"; 
import { toast } from "react-toastify";
import ChangePasswordModal from "./ChangePasswordModal";

const OperatorLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const queryClient = useQueryClient();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    try {
      // Clear React Query cache
      queryClient.clear();
      
      // Call AuthContext logout (removes token + updates state)
      logout();
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to login page
      navigate("/login");
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
      
      // Force redirect anyway
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
      <OperatorHeader onLogout={handleLogout} />
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

export default OperatorLayout;

