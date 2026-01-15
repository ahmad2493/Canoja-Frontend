import React, { useState } from "react";
import OperatorLayout from "./OperatorLayout";
import { toast } from "react-toastify";

const OperatorDashboard = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Dummy subscription plans
  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 49,
      period: "month",
      features: [
        "Up to 1 business location",
        "Basic business profile",
        "Customer reviews management",
        "Email support",
        "Basic analytics",
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: 99,
      period: "month",
      features: [
        "Up to 5 business locations",
        "Advanced business profile",
        "Customer reviews management",
        "Priority email support",
        "Advanced analytics",
        "Social media integration",
        "Custom branding",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 199,
      period: "month",
      features: [
        "Unlimited business locations",
        "Premium business profile",
        "Customer reviews management",
        "24/7 phone & email support",
        "Advanced analytics & reporting",
        "Social media integration",
        "Custom branding",
        "API access",
        "Dedicated account manager",
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (planId) => {
    setSelectedPlan(planId);
    toast.success(`Selected ${subscriptionPlans.find(p => p.id === planId)?.name}. Payment integration coming soon!`);
  };

  return (
    <OperatorLayout>
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          borderBottom: "1px solid #e2e8f0",
          padding: "24px 32px",
        }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1e293b",
            margin: "0 0 8px 0",
          }}>
            Subscription Plans
          </h1>
          <p style={{
            color: "#64748b",
            fontSize: "16px",
            margin: 0,
          }}>
            Choose the perfect plan for your business needs
          </p>
        </div>

        {/* Content */}
        <div style={{
          padding: "40px 32px",
        }}>
          {/* Plans Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}>
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: plan.popular 
                    ? "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)"
                    : "#ffffff",
                  border: plan.popular 
                    ? "2px solid #10b981"
                    : "2px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "32px",
                  position: "relative",
                  transition: "all 0.3s ease",
                  boxShadow: plan.popular 
                    ? "0 8px 16px rgba(16, 185, 129, 0.15)"
                    : "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = plan.popular 
                    ? "0 12px 24px rgba(16, 185, 129, 0.2)"
                    : "0 8px 16px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = plan.popular 
                    ? "0 8px 16px rgba(16, 185, 129, 0.15)"
                    : "0 2px 4px rgba(0, 0, 0, 0.05)";
                }}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    padding: "6px 20px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
                  }}>
                    MOST POPULAR
                  </div>
                )}

                {/* Plan Name */}
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 8px 0",
                }}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div style={{
                  marginBottom: "24px",
                }}>
                  <span style={{
                    fontSize: "48px",
                    fontWeight: "800",
                    color: "#10b981",
                    lineHeight: "1",
                  }}>
                    ${plan.price}
                  </span>
                  <span style={{
                    fontSize: "18px",
                    color: "#64748b",
                    marginLeft: "4px",
                  }}>
                    /{plan.period}
                  </span>
                </div>

                {/* Features List */}
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 32px 0",
                }}>
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "12px 0",
                        borderBottom: index < plan.features.length - 1 ? "1px solid #f1f5f9" : "none",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                          marginTop: "2px",
                          flexShrink: 0,
                        }}>
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span style={{
                        color: "#475569",
                        fontSize: "15px",
                        lineHeight: "1.5",
                      }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  style={{
                    width: "100%",
                    background: plan.popular
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : selectedPlan === plan.id
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                    color: plan.popular || selectedPlan === plan.id ? "#ffffff" : "#475569",
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px 24px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: plan.popular
                      ? "0 4px 8px rgba(16, 185, 129, 0.3)"
                      : "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.popular && selectedPlan !== plan.id) {
                      e.target.style.background = "linear-gradient(135deg, #10b981, #059669)";
                      e.target.style.color = "#ffffff";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 8px rgba(16, 185, 129, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.popular && selectedPlan !== plan.id) {
                      e.target.style.background = "linear-gradient(135deg, #f1f5f9, #e2e8f0)";
                      e.target.style.color = "#475569";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                    }
                  }}>
                  {selectedPlan === plan.id ? "Selected" : "Subscribe Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OperatorLayout>
  );
};

export default OperatorDashboard;

