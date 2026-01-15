import React from "react";

const Sidebar = ({ isOpen, onToggle, onChangePassword }) => {
  return (
    <>
      {/* Floating Hamburger Menu Button (always visible) */}
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          left: "20px",
          top: "88px",
          width: "48px",
          height: "48px",
          background: isOpen 
            ? "linear-gradient(135deg, #ef4444, #dc2626)"
            : "linear-gradient(135deg, #10b981, #059669)",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isOpen
            ? "0 4px 12px rgba(239, 68, 68, 0.3)"
            : "0 4px 12px rgba(16, 185, 129, 0.3)",
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = isOpen
            ? "0 6px 16px rgba(239, 68, 68, 0.4)"
            : "0 6px 16px rgba(16, 185, 129, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = isOpen
            ? "0 4px 12px rgba(239, 68, 68, 0.3)"
            : "0 4px 12px rgba(16, 185, 129, 0.3)";
        }}>
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? "280px" : "0",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          borderRight: isOpen ? "1px solid #e2e8f0" : "none",
          padding: isOpen ? "24px 0" : "0",
          minHeight: "calc(100vh - 72px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          position: "relative",
          boxShadow: isOpen ? "2px 0 8px rgba(0, 0, 0, 0.05)" : "none",
        }}>
        {/* Sidebar Content */}
        {isOpen && (
          <>
            {/* Sidebar Header */}
            <div style={{
              padding: "0 20px 24px 20px",
              borderBottom: "1px solid #e2e8f0",
              marginBottom: "16px",
            }}>
              <h3 style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: 0,
              }}>
                Menu
              </h3>
            </div>

            {/* Navigation Items */}
            <nav style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              padding: "0 12px",
            }}>
              <button
                onClick={onChangePassword}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#475569",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #f0fdf4, #dcfce7)";
                  e.target.style.color = "#10b981";
                  e.target.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#475569";
                  e.target.style.transform = "translateX(0)";
                }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </div>
                <span>Change Password</span>
              </button>
            </nav>
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

