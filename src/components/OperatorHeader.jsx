import React, { useState, useEffect } from "react";
import canojaLogo from "../assets/canojaLogo.png";
import { useAuth } from "../context/AuthContext";

const OperatorHeader = ({ onLogout, title = "Operator Dashboard" }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerStyles = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(8px)",
    width: "100%",
    boxSizing: "border-box",
  };

  const containerStyles = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: isMobile ? "64px" : "72px",
    padding: isMobile ? "0 16px" : "0 24px",
    boxSizing: "border-box",
  };

  const logoSectionStyles = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "12px" : "16px",
  };

  const logoStyles = {
    width: isMobile ? 32 : 40,
    height: isMobile ? 32 : 40,
    borderRadius: isMobile ? 8 : 12,
    objectFit: "cover",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const titleStyles = {
    color: "#10b981",
    fontWeight: "800",
    fontSize: isMobile ? "20px" : "28px",
    margin: 0,
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const subtitleStyles = {
    color: "#64748b",
    fontSize: isMobile ? "12px" : "14px",
    margin: 0,
    fontWeight: "500",
    display: isMobile ? "none" : "block",
  };

  const actionSectionStyles = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "8px" : "16px",
  };

  const welcomeStyles = {
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    borderRadius: "12px",
    padding: isMobile ? "6px 12px" : "8px 16px",
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: "500",
    color: "#475569",
    border: "1px solid #e2e8f0",
    display: isMobile ? "none" : "block",
  };

  const logoutStyles = {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: isMobile ? "6px 12px" : "8px 20px",
    fontWeight: 600,
    fontSize: isMobile ? "12px" : "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
  };

  return (
    <>
      <style>
        {`
          .logout-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
          }
        `}
      </style>

      <header style={headerStyles}>
        <div style={containerStyles}>
          <div style={logoSectionStyles}>
            <img src={canojaLogo} alt="Canoja Logo" style={logoStyles} />
            <div>
              <h1 style={titleStyles}>Canoja</h1>
              <p style={subtitleStyles}>{title}</p>
            </div>
          </div>
          <div style={actionSectionStyles}>
            <div style={welcomeStyles}>
              Welcome, {user?.email?.split("@")[0] || "Operator"}
            </div>
            <button 
              className="logout-btn" 
              onClick={onLogout} 
              style={logoutStyles}>
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default OperatorHeader;

