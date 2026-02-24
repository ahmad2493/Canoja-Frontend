import React, { useState } from "react";
import OperatorLayout from "./OperatorLayout";
import { toast } from "react-toastify";
import {
  useBusinessDashboard,
  useBusinessLocation,
  useBusinessProfile,
  useUpdateBusinessProfile,
  useToggleBusinessVisibility,
  useUploadMenu,
  useEngagementStats,
} from "../services/business";

const OperatorDashboard = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMenuUpload, setShowMenuUpload] = useState(false);
  const [showMenuViewer, setShowMenuViewer] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});

  // API Hooks
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useBusinessDashboard();
  const { data: locationData, isLoading: locationLoading } = useBusinessLocation();
  const { data: profileData, isLoading: profileLoading } = useBusinessProfile();
  const { data: engagementData } = useEngagementStats();
  
  const updateProfileMutation = useUpdateBusinessProfile();
  const toggleVisibilityMutation = useToggleBusinessVisibility();
  const uploadMenuMutation = useUploadMenu();

  // Get dashboard data
  const businessHealth = dashboardData?.data?.business_health;
  const businessName = dashboardData?.data?.business_name;
  const menuUrl = dashboardData?.data?.menu_url;

  // Handle visibility toggle
  const handleToggleVisibility = async () => {
    const currentVisibility = businessHealth?.visibility?.status === "visible";
    try {
      await toggleVisibilityMutation.mutateAsync(!currentVisibility);
      toast.success(`Business is now ${!currentVisibility ? "visible" : "hidden"}`);
    } catch (error) {
      toast.error(error.message || "Failed to update visibility");
    }
  };

  // Handle menu upload
  const handleMenuUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or PDF file");
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be less than 20MB");
      return;
    }

    try {
      await uploadMenuMutation.mutateAsync(file);
      toast.success("Menu uploaded successfully!");
      setShowMenuUpload(false);
    } catch (error) {
      toast.error(error.message || "Failed to upload menu");
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Remove email from update data - it cannot be changed
      const { email, ...updateData } = profileFormData;
      await updateProfileMutation.mutateAsync(updateData);
      toast.success("Profile updated successfully!");
      setShowProfileModal(false);
      setProfileFormData({});
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  // Get status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
      case "visible":
      case "uploaded":
        return "#10b981"; // Green
      case "pending_review":
        return "#f59e0b"; // Yellow/Orange
      case "hidden":
      case "no_menu":
      case "not_verified":
        return "#ef4444"; // Red
      default:
        return "#6b7280"; // Gray
    }
  };

  // Get status icon
  const getStatusIcon = (type, status) => {
    if (type === "verification") {
      if (status === "verified") {
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke={getStatusColor(status)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke={getStatusColor(status)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (type === "visibility") {
      if (status === "visible") {
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke={getStatusColor(status)} strokeWidth="2" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke={getStatusColor(status)} strokeWidth="2" />
          </svg>
        );
      }
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke={getStatusColor(status)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (type === "menu") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke={getStatusColor(status)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (type === "engagement") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke={getStatusColor("default")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
  };

  if (dashboardLoading) {
    return (
      <OperatorLayout>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading dashboard...</p>
        </div>
      </OperatorLayout>
    );
  }

  if (dashboardError) {
    return (
      <OperatorLayout>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#ef4444" }}>Error loading dashboard. Please try again.</p>
        </div>
      </OperatorLayout>
    );
  }

  return (
    <OperatorLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px 32px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 8px 0",
          }}>
            Your Business
          </h1>
          <p style={{
            color: "#64748b",
            fontSize: "16px",
            margin: 0,
          }}>
            {businessName || "Business Dashboard"}
          </p>
        </div>

        {/* Business Health Section */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px 32px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 24px 0",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            Business Health
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}>
            {/* Verification Card */}
            <div style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                {getStatusIcon("verification", businessHealth?.verification?.status)}
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>
                  Verification
                </h3>
              </div>
              <p style={{
                fontSize: "16px",
                fontWeight: "600",
                color: getStatusColor(businessHealth?.verification?.status),
                margin: "4px 0 0 0",
              }}>
                {businessHealth?.verification?.message || "Pending Review"}
              </p>
            </div>

            {/* Visibility Card */}
            <div style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
            onClick={handleToggleVisibility}
            title="Click to toggle visibility">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                {getStatusIcon("visibility", businessHealth?.visibility?.status)}
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>
                  Visibility
                </h3>
              </div>
              <p style={{
                fontSize: "16px",
                fontWeight: "600",
                color: getStatusColor(businessHealth?.visibility?.status),
                margin: "4px 0 0 0",
              }}>
                {businessHealth?.visibility?.message || "Visible"}
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                {businessHealth?.visibility?.status === "visible" ? "Not visible" : "Visible"}
              </p>
            </div>

            {/* Menu Freshness Card */}
            <div style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                {getStatusIcon("menu", businessHealth?.menu_freshness?.status)}
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>
                  Menu Freshness
                </h3>
              </div>
              <p style={{
                fontSize: "16px",
                fontWeight: "600",
                color: getStatusColor(businessHealth?.menu_freshness?.status),
                margin: "4px 0 0 0",
              }}>
                {businessHealth?.menu_freshness?.message || "No menu"}
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                {businessHealth?.menu_freshness?.status === "uploaded" ? "Menu uploaded" : "Upload a menu"}
              </p>
            </div>

            {/* Engagement Card */}
            <div style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e5e7eb",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                {getStatusIcon("engagement", "default")}
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>
                  Engagement
                </h3>
              </div>
              <p style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1e293b",
                margin: "4px 0 0 0",
              }}>
                {businessHealth?.engagement?.count !== undefined ? businessHealth.engagement.count : engagementData?.data?.view_count || 0}
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                {businessHealth?.engagement?.message || "Views this week"}
              </p>
            </div>
          </div>
        </div>

        {/* Manage Section */}
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px 32px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 24px 0",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            Manage
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Locations */}
            <div
              onClick={() => setShowLocationModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "#f9fafb",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.borderColor = "#10b981";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "0 0 4px 0" }}>
                    Locations
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    View and manage your business address
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Profile Information */}
            <div
              onClick={() => {
                if (profileData?.data) {
                  setProfileFormData(profileData.data);
                }
                setShowProfileModal(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "#f9fafb",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.borderColor = "#10b981";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "0 0 4px 0" }}>
                    Profile Information
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    Update name, hours, contact details
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Menu Snapshot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "#f9fafb",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s ease",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: 0 }}>
                      Menu Snapshot
                    </h3>
                    {businessHealth?.menu_freshness?.status === "no_menu" && (
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#ffffff",
                        background: "#10b981",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}>
                        ADD
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                    {menuUrl ? "View or update your menu" : "Upload your latest menu image or PDF"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {menuUrl && (
                  <button
                    onClick={() => setShowMenuViewer(true)}
                    style={{
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}>
                    View
                  </button>
                )}
                <button
                  onClick={() => setShowMenuUpload(true)}
                  style={{
                    padding: "8px 16px",
                    background: menuUrl ? "#f3f4f6" : "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: menuUrl ? "#374151" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (menuUrl) {
                      e.currentTarget.style.background = "#e5e7eb";
                    } else {
                      e.currentTarget.style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (menuUrl) {
                      e.currentTarget.style.background = "#f3f4f6";
                    } else {
                      e.currentTarget.style.opacity = "1";
                    }
                  }}>
                  {menuUrl ? "Update" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification in Progress Alert */}
        {businessHealth?.verification?.status === "pending_review" && (
          <div style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: "16px",
            padding: "20px 24px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 4px 0" }}>
                Verification in Progress
              </h3>
              <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>
                Your request is being reviewed. We'll notify you once approved.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setShowLocationModal(false)}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 20px 0" }}>
              Business Location
            </h2>
            {locationLoading ? (
              <p>Loading location...</p>
            ) : locationData?.data ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Address
                  </label>
                  <p style={{ fontSize: "16px", color: "#1e293b", margin: 0 }}>
                    {locationData.data.address}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    City, State
                  </label>
                  <p style={{ fontSize: "16px", color: "#1e293b", margin: 0 }}>
                    {locationData.data.city}, {locationData.data.state} {locationData.data.postal_code}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Coordinates
                  </label>
                  <p style={{ fontSize: "16px", color: "#1e293b", margin: 0 }}>
                    {locationData.data.coordinates?.lat?.toFixed(6)}, {locationData.data.coordinates?.lng?.toFixed(6)}
                  </p>
                </div>
              </div>
            ) : (
              <p>No location data available</p>
            )}
            <button
              onClick={() => setShowLocationModal(false)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#374151",
                cursor: "pointer",
              }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setShowProfileModal(false)}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 20px 0" }}>
              Profile Information
            </h2>
            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={profileFormData.business_name || ""}
                    onChange={(e) => setProfileFormData({ ...profileFormData, business_name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileFormData.phone || ""}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileFormData.email || ""}
                    disabled
                    readOnly
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                      background: "#f3f4f6",
                      color: "#6b7280",
                      cursor: "not-allowed",
                    }}
                  />
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
                    Email cannot be changed 
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileFormData.website || ""}
                    onChange={(e) => setProfileFormData({ ...profileFormData, website: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Description
                  </label>
                  <textarea
                    value={profileFormData.description || ""}
                    onChange={(e) => setProfileFormData({ ...profileFormData, description: e.target.value })}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                  }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: updateProfileMutation.isPending ? "#9ca3af" : "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#ffffff",
                    cursor: updateProfileMutation.isPending ? "not-allowed" : "pointer",
                  }}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Upload Modal */}
      {showMenuUpload && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setShowMenuUpload(false)}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "500px",
            width: "90%",
          }}
          onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 20px 0" }}>
              Upload Menu
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px 0" }}>
              Upload a JPEG, PNG, or PDF file (max 20MB)
            </p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleMenuUpload}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            />
            <button
              onClick={() => setShowMenuUpload(false)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#374151",
                cursor: "pointer",
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Menu Viewer Modal */}
      {showMenuViewer && menuUrl && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={() => setShowMenuViewer(false)}>
          <div style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "0",
            maxWidth: "90vw",
            maxHeight: "90vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "16px 24px",
              background: "#1e293b",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#ffffff" }}>
                Menu
              </h2>
              <button
                onClick={() => setShowMenuViewer(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#ffffff",
                  padding: "4px 8px",
                  lineHeight: "1",
                  opacity: 0.8,
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}>
                ×
              </button>
            </div>
            <div style={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              background: "#0f172a",
              padding: "0",
            }}>
              {menuUrl.endsWith('.pdf') || menuUrl.includes('.pdf') ? (
                <iframe
                  src={`${menuUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  style={{
                    width: "100%",
                    height: "calc(90vh - 120px)",
                    border: "none",
                    background: "#0f172a",
                  }}
                  title="Menu PDF"
                />
              ) : (
                <img
                  src={menuUrl}
                  alt="Menu"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              )}
            </div>
            <div style={{ 
              display: "flex", 
              gap: "12px", 
              padding: "16px 24px",
              background: "#1e293b",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#ffffff",
                  textDecoration: "none",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}>
                Open in New Tab
              </a>
              <button
                onClick={() => setShowMenuViewer(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </OperatorLayout>
  );
};

export default OperatorDashboard;
