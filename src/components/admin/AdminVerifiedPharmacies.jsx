import React, { useState, useEffect } from "react";
import AdminShell from "./AdminShell";
import { useCompareShops } from "../../services/admin";

const C = {
  border: "#dce7e1",
  textPrimary: "#18212b",
  textSecondary: "#617182",
  greenDark: "#1b6b46",
  green: "#2da96d",
};

function Tag({ label }) {
  const map = {
    "Licensed":      { bg: "#edf9f2", color: "#1f9d61" },
    "Top Rated":     { bg: "#edf9f2", color: "#1f9d61" },
    "Delivery":      { bg: "#edf9f2", color: "#1f9d61" },
    "Pickup":        { bg: "#edf9f2", color: "#1f9d61" },
    "New":           { bg: "#edf9f2", color: "#1f9d61" },
    "Open Now":      { bg: "#edf9f2", color: "#1f9d61" },
    "Has Menu":      { bg: "#edf9f2", color: "#1f9d61" },
    "Expiring Soon": { bg: "#fff5eb", color: "#d9822b" },
    "Renewal Due":   { bg: "#fff5eb", color: "#d9822b" },
  };
  const s = map[label] || { bg: "#f4f7fa", color: "#617182" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      height: "26px", padding: "0 10px", borderRadius: "999px",
      background: s.bg, color: s.color, fontSize: "12px", fontWeight: 800,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function buildTags(s) {
  const now = new Date();
  const d30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const exp = s.expiration_date ? new Date(s.expiration_date) : null;
  const tags = [];
  if (s.license_status && s.license_status !== "Inactive") tags.push("Licensed");
  if (s.open_now === true) tags.push("Open Now");
  if (s.rating >= 4.5) tags.push("Top Rated");
  if (s.menu_link || s.menu) tags.push("Has Menu");
  if (s.order_links) tags.push("Delivery");
  if ((s.subtypes || []).some(t => /pickup|pick-up/i.test(t))) tags.push("Pickup");
  if (exp && exp > now && exp <= d30) tags.push("Expiring Soon");
  if (exp && exp < now) tags.push("Renewal Due");
  return tags;
}

function PharmacyCard({ shop: s }) {
  const location = [s.city, s.stateName].filter(Boolean).join(", ");
  const descParts = [];
  if (s.license_status) descParts.push(`${s.license_status} license`);
  if (s.open_now === true) descParts.push("Open now");
  if (s.rating) descParts.push(`${s.rating}★`);
  const tags = buildTags(s);

  return (
    <div style={{
      background: "#fff", border: "0.8px solid #dce7e1", borderRadius: "20px",
      boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.06)",
      padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
        <div>
          <p style={{ fontSize: "16px", fontWeight: 800, color: C.textPrimary, lineHeight: "23.2px", margin: 0 }}>
            {s.name || "—"}
          </p>
          <p style={{ fontSize: "13.12px", fontWeight: 400, color: C.textSecondary, lineHeight: "19.024px", margin: "2px 0 0 0" }}>
            {location || "—"}
          </p>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center",
          height: "26px", padding: "0 10px", borderRadius: "999px",
          background: "rgba(212,167,44,0.15)", border: "0.8px solid rgba(212,167,44,0.35)",
          color: "#b5850a", fontSize: "12px", fontWeight: 800,
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          Verified
        </span>
      </div>
      <p style={{ fontSize: "14.08px", fontWeight: 400, color: C.textSecondary, lineHeight: "20.416px", margin: 0 }}>
        {descParts.join(" · ") || "Canoja Verified"}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {tags.map(t => <Tag key={t} label={t} />)}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
        <button style={{
          flex: 1, height: "42px", borderRadius: "12px",
          backgroundImage: "linear-gradient(161deg, #1b6b46 0%, #2da96d 100%)",
          border: "0.8px solid rgba(0,0,0,0)", color: "#fff",
          fontSize: "13.333px", fontWeight: 700, cursor: "pointer",
        }}>View Profile</button>
        <button style={{
          height: "42px", padding: "0 16px", borderRadius: "12px",
          background: "#fff", border: "0.8px solid #dce7e1",
          color: C.textPrimary, fontSize: "13.333px", fontWeight: 700, cursor: "pointer",
        }}>Directions</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, deltaBg, deltaColor }) {
  return (
    <div style={{
      background: "#fff", border: "0.8px solid #dce7e1", borderRadius: "24px",
      boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.06)",
      padding: "20px", overflow: "clip", position: "relative",
    }}>
      <div style={{
        position: "absolute", right: "-12px", top: "-12px",
        width: "80px", height: "80px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,169,109,0.13) 0%, rgba(45,169,109,0) 70%)",
        pointerEvents: "none",
      }} />
      <p style={{ fontSize: "14.08px", fontWeight: 400, color: C.textSecondary, lineHeight: "20.416px", marginBottom: "8px" }}>
        {label}
      </p>
      <p style={{ fontSize: "30.4px", fontWeight: 800, color: C.textPrimary, letterSpacing: "-0.912px", lineHeight: "44.08px", margin: 0 }}>
        {value}
      </p>
      <span style={{
        display: "inline-flex", alignItems: "center",
        marginTop: "10px", padding: "6px 10px", borderRadius: "999px",
        background: deltaBg, color: deltaColor,
        fontSize: "13.12px", fontWeight: 800, lineHeight: "19.024px", whiteSpace: "nowrap",
      }}>
        {delta}
      </span>
    </div>
  );
}

const DISTANCE_OPTIONS = [
  { label: "Within 5 miles",  value: 8047 },
  { label: "Within 10 miles", value: 16093 },
  { label: "Within 25 miles", value: 40234 },
  { label: "Within 50 miles", value: 80467 },
  { label: "Any distance",    value: null },
];

const STATE_OPTIONS = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","Jamaica","USVI",
];

export default function AdminVerifiedPharmacies() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [market, setMarket] = useState("");
  const [availability, setAvailability] = useState(""); // "openNow" | "delivery"
  const [serviceType, setServiceType] = useState(""); // "pickup" | "delivery"
  const [distance, setDistance] = useState(null); // radius in metres, null = any

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const requestBody = (() => {
    const filters = { canojaVerified: true };
    if (availability === "openNow") filters.openNow = true;
    if (availability === "delivery" || serviceType === "delivery") filters.hasMenu = true;
    if (market) filters.state = market;

    const body = {
      lat: 39.5, lng: -98.35,
      radius: distance ?? 5000000,
      filters,
      page: 1, limit: 50,
    };

    if (debouncedSearch) body.keyword = debouncedSearch;
    return body;
  })();

  const { data: apiData, isLoading } = useCompareShops(requestBody);

  const shops = apiData?.data?.shops || [];
  const totalVerified = apiData?.data?.pagination?.total_results ?? "—";
  const openNowCount = shops.filter(s => s.open_now === true).length;
  const deliveryCount = shops.filter(s => s.menu_link || s.menu || s.order_links).length;

  // Pickup: filter client-side on services array extracted by formatShopData
  const filtered = shops.filter(s => {
    if (serviceType === "pickup" && !(s.services || []).some(t => /pickup|pick-up/i.test(t))) return false;
    return true;
  });

  const avgRating = shops.length
    ? (shops.reduce((sum, s) => sum + (s.rating || 0), 0) / (shops.filter(s => s.rating).length || 1)).toFixed(1)
    : "—";

  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");
    setMarket("");
    setAvailability("");
    setServiceType("");
    setDistance(null);
  };

  return (
    <AdminShell>
      <div style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.96) 100%)",
        border: "0.8px solid rgba(194,210,202,0.5)", borderRadius: "28px",
        boxShadow: "0px 8px 24px 0px rgba(13,59,42,0.08)",
        overflow: "clip", position: "relative",
      }}>
        {/* Header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(255,255,255,0.76)", borderBottom: "0.8px solid #dce7e1",
          padding: "24px 24px 24.8px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "24px", backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h1 style={{ fontSize: "28.8px", fontWeight: 800, color: C.textPrimary, letterSpacing: "-0.576px", lineHeight: "41.76px", margin: 0 }}>
              Verified Pharmacies
            </h1>
            <p style={{ fontSize: "15.36px", fontWeight: 400, color: C.textSecondary, lineHeight: "22.272px", maxWidth: "620px", margin: 0 }}>
              Public-facing marketplace directory with verified-first trust signals and consumer-ready filtering.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <button style={{
              height: "42px", padding: "0 20px", borderRadius: "12px",
              background: "#fff", border: "0.8px solid #dce7e1",
              color: C.textPrimary, fontSize: "13.333px", fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap",
            }}>Preview Mobile</button>
            <button style={{
              height: "42px", padding: "0 20px", borderRadius: "12px",
              backgroundImage: "linear-gradient(161deg, #1b6b46 0%, #2da96d 100%)",
              border: "0.8px solid rgba(0,0,0,0)", color: "#fff",
              fontSize: "13.333px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}>Publish Directory</button>
          </div>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Hero search card */}
          <div style={{
            borderRadius: "24px",
            backgroundImage: "linear-gradient(155deg, #1b6b46 0%, #2eb870 100%)",
            padding: "28px 32px", overflow: "clip",
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center",
              height: "34px", padding: "0 14px", borderRadius: "999px",
              background: "rgba(0,0,0,0.22)", color: "#fff",
              fontSize: "12.8px", fontWeight: 800, whiteSpace: "nowrap", marginBottom: "20px",
            }}>
              Public Layer · Marketplace Search
            </span>
            <h2 style={{
              fontSize: "32px", fontWeight: 800, color: "#fff",
              letterSpacing: "-0.64px", lineHeight: "1.2", margin: "0 0 14px 0", maxWidth: "680px",
            }}>
              Find trusted verified operators near you
            </h2>
            <p style={{
              fontSize: "16px", fontWeight: 400, color: "rgba(255,255,255,0.75)",
              lineHeight: "23.2px", margin: "0 0 24px 0", maxWidth: "680px",
            }}>
              Search by name, city, or license number. Verification is visible by default so consumers quickly understand who is licensed, active, and trusted on Canoja.
            </p>
            <div style={{ position: "relative", maxWidth: "520px" }}>
              <span style={{
                position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                color: "#8090a3", fontSize: "14.4px", pointerEvents: "none",
              }}>⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search dispensary, city, license number"
                style={{
                  width: "100%", height: "52px", paddingLeft: "44px", paddingRight: "18px",
                  borderRadius: "14px", border: "0.8px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.97)",
                  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.12)",
                  fontSize: "15px", color: C.textPrimary, outline: "none",
                  fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Content grid */}
          <div style={{ display: "grid", gridTemplateColumns: "300px minmax(0,1fr)", gap: "18px" }}>

            {/* Filters panel */}
            <div style={{
              position: "sticky", top: "24px", alignSelf: "start",
              background: "#fff", border: "0.8px solid #dce7e1", borderRadius: "24px",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.06)", padding: "20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: C.textPrimary }}>Browse Filters</span>
                <button onClick={handleReset} style={{ fontSize: "14.08px", fontWeight: 700, color: "#1b6b46", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Reset
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Distance */}
                <div>
                  <label style={{ display: "block", fontSize: "13.76px", fontWeight: 800, color: C.textPrimary, marginBottom: "8px" }}>
                    Distance
                  </label>
                  <select
                    value={distance ?? ""}
                    onChange={e => setDistance(e.target.value ? parseInt(e.target.value) : null)}
                    style={{
                      width: "100%", height: "42px", padding: "0 12px",
                      borderRadius: "12px", border: "0.8px solid #dce7e1",
                      background: "#fff", fontSize: "14.72px", color: C.textPrimary,
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    {DISTANCE_OPTIONS.map(o => (
                      <option key={o.label} value={o.value ?? ""}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label style={{ display: "block", fontSize: "13.76px", fontWeight: 800, color: C.textPrimary, marginBottom: "8px" }}>
                    Availability
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Open Now", value: "openNow", count: openNowCount },
                      { label: "Delivery",  value: "delivery", count: deliveryCount },
                    ].map(({ label, value, count }) => (
                      <div
                        key={value}
                        onClick={() => setAvailability(availability === value ? "" : value)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10.8px 12.8px", borderRadius: "12px",
                          border: `0.8px solid ${availability === value ? "#2da96d" : "#dce7e1"}`,
                          background: availability === value ? "#edf9f2" : "#fcfefd",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontSize: "14.72px", fontWeight: 400, color: C.textPrimary }}>{label}</span>
                        <span style={{ fontSize: "13.12px", fontWeight: 700, color: C.textSecondary }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label style={{ display: "block", fontSize: "13.76px", fontWeight: 800, color: C.textPrimary, marginBottom: "8px" }}>
                    Service Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value)}
                    style={{
                      width: "100%", height: "42px", padding: "0 12px",
                      borderRadius: "12px", border: "0.8px solid #dce7e1",
                      background: "#fff", fontSize: "14.72px", color: C.textPrimary,
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="">All Types</option>
                    <option value="pickup">Pickup Only</option>
                    <option value="delivery">Delivery Only</option>
                  </select>
                </div>

                {/* Market */}
                <div>
                  <label style={{ display: "block", fontSize: "13.76px", fontWeight: 800, color: C.textPrimary, marginBottom: "8px" }}>
                    Market
                  </label>
                  <select
                    value={market}
                    onChange={e => setMarket(e.target.value)}
                    style={{
                      width: "100%", height: "42px", padding: "0 12px",
                      borderRadius: "12px", border: "0.8px solid #dce7e1",
                      background: "#fff", fontSize: "14.72px", color: C.textPrimary,
                      outline: "none", cursor: "pointer",
                    }}
                  >
                    <option value="">All Markets</option>
                    {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "18px" }}>
                <StatCard
                  label="Verified Results"
                  value={typeof totalVerified === "number" ? totalVerified.toLocaleString() : totalVerified}
                  delta="Canoja Verified"
                  deltaBg="#edf9f2" deltaColor="#1f9d61"
                />
                <StatCard
                  label="Open Now"
                  value={openNowCount}
                  delta="Live operating hours"
                  deltaBg="#edf5ff" deltaColor="#2f80ed"
                />
                <StatCard
                  label="Delivery Ready"
                  value={deliveryCount}
                  delta="Delivery available"
                  deltaBg="#fff5eb" deltaColor="#d9822b"
                />
                <StatCard
                  label="Avg Rating"
                  value={avgRating}
                  delta="Across results"
                  deltaBg="#edf9f2" deltaColor="#1f9d61"
                />
              </div>

              {isLoading && (
                <div style={{ textAlign: "center", padding: "40px", color: C.textSecondary, fontSize: "14px" }}>
                  Loading verified pharmacies…
                </div>
              )}

              {!isLoading && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" }}>
                  {filtered.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: C.textSecondary, fontSize: "14px" }}>
                      No results found.
                    </div>
                  ) : (
                    filtered.map(s => <PharmacyCard key={s._id} shop={s} />)
                  )}
                </div>
              )}

              <div style={{
                background: "#fff", border: "0.8px solid #dce7e1", borderRadius: "20px",
                boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.06)", padding: "18px 20px",
              }}>
                <p style={{ fontSize: "14.08px", fontWeight: 400, color: C.textSecondary, lineHeight: "20.416px", margin: 0 }}>
                  Public directory design preserves Canoja's compliance-first positioning through clear verified badging, live license health, and future-ready delivery filters.
                  {apiData?.data?.pagination && (
                    <span style={{ marginLeft: "8px", fontWeight: 700, color: C.textPrimary }}>
                      Showing {filtered.length} of {typeof totalVerified === "number" ? totalVerified.toLocaleString() : totalVerified} verified pharmacies.
                    </span>
                  )}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
