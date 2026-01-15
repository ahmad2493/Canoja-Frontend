import React, { useState, useEffect } from "react";
import canojaLogo from "../assets/canojaLogo.png";
import { searchShops, loadMoreShops } from "../services/api";
import { getStates, getCities, getZipcodes } from "@mardillu/us-cities-utils";

const ShopFinder = () => {
  const [formData, setFormData] = useState({
    latitude: 42.4449498,
    longitude: -71.0288195,
    radius: 5000,
  });

  // New location fields
  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
    zipCode: "",
    useCoordinates: false, // Default to location fields instead of coordinates
  });

  const [actualCoordinates, setActualCoordinates] = useState({
  lat: null,
  lng: null,
  radius: null
});

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zips, setZips] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({});

  // Pagination state
  const [pagination, setPagination] = useState({
    has_more: false,
    session_key: null,
    current_page: 1,
  });

  // Search info state
  const [searchInfo, setSearchInfo] = useState({});

  const [filters, setFilters] = useState({
    smokeShop: false,
    licensed: false,
    openNow: false,
    cannabis: false,
  });

  const titleStyles = {
    color: "#10b981",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
  };

  useEffect(() => {
  const allStates = getStates();
  setStates(allStates);
}, []);


  useEffect(() => {
    if (locationData.state) {
      setCities(getCities(locationData.state));
      setLocationData((prev) => ({ ...prev, city: "", zipCode: "" }));
    } else {
      setCities([]);
      setZips([]);
    }
  }, [locationData.state]);

  useEffect(() => {
  if (locationData.city) {
    const allZips = getZipcodes(locationData.state)
      .filter((cityData) => cityData.name === locationData.city) 
      .map((cityData) => cityData.zip);
    setZips(allZips);
    setLocationData((prev) => ({ ...prev, zipCode: "" }));
  } else {
    setZips([]);
  }
}, [locationData.city]);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation && locationData.useCoordinates) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6)),
          }));
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  }, [locationData.useCoordinates]);

  // Apply filters when filters change or shops data changes
  useEffect(() => {
    applyFilters();
  }, [filters, allShops]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "radius" ? parseInt(value) : parseFloat(value),
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocationData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSearchShops = async (e) => {
    e.preventDefault();

    // Reset state for new search
    setAllShops([]);
    setFilteredShops([]);
    setPagination({ has_more: false, session_key: null, current_page: 1 });
    setSearchInfo({});
    setActualCoordinates({ lat: null, lng: null, radius: null });

    let searchPayload = {};

    if (locationData.useCoordinates) {
      if (!formData.latitude || !formData.longitude) {
        setError("Please enter valid latitude and longitude values.");
        return;
      }
      searchPayload = {
        lat: formData.latitude,
        lng: formData.longitude,
        radius: formData.radius,
      };
    } else {
      if (!locationData.city && !locationData.state && !locationData.zipCode) {
        setError(
          "Please enter at least one location field (city, state, or zip code)."
        );
        return;
      }

      // Use location data for search
      searchPayload = {
        city: locationData.city,
        state: locationData.state,
        zipCode: locationData.zipCode,
        radius: formData.radius,
      };
    }

    setLoading(true);
    setError("");

    try {
      const result = await searchShops(searchPayload);

      if (result.success && result.data) {
        setAllShops(result.data.shops || []);
        setStats(result.data.debug || {});
        setPagination(result.data.pagination || {});
        setSearchInfo(result.data.search_info || {});
        if (result.data.location_info && result.data.location_info.final_coordinates) {
        setActualCoordinates({
          lat: result.data.location_info.final_coordinates.lat,
          lng: result.data.location_info.final_coordinates.lng,
          radius: result.data.location_info.radius_used
        });
      }
        setShowStats(true);
        setShowFilters(true);
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(`Failed to search shops: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreShops = async () => {
  if (!pagination.has_more || loadingMore) return;

  setLoadingMore(true);
  setError("");

  try {
    const nextPage = pagination.current_page + 1;  // ← Increment page
    
    let searchPayload = {
      page: nextPage,  // ← CRITICAL: Send page number
      limit: 50,       // ← Match your desired limit
    };

    // Use the actual coordinates that were used in the initial search
    if (actualCoordinates.lat && actualCoordinates.lng) {
      searchPayload = {
        ...searchPayload,
        lat: actualCoordinates.lat,
        lng: actualCoordinates.lng,
        radius: actualCoordinates.radius,
      };
    } else if (locationData.useCoordinates) {
      searchPayload = {
        ...searchPayload,
        lat: formData.latitude,
        lng: formData.longitude,
        radius: formData.radius,
      };
    } else {
      searchPayload = {
        ...searchPayload,
        city: locationData.city,
        state: locationData.state,
        zipCode: locationData.zipCode,
        radius: formData.radius,
      };
    }

    console.log("Load more payload:", searchPayload);

    const result = await searchShops(searchPayload);  // ← Use searchShops, not loadMoreShops

    if (result.success && result.data) {
      const newShops = result.data.shops || [];
      setAllShops((prev) => [...prev, ...newShops]);
      setPagination(result.data.pagination || {});
      setSearchInfo(result.data.search_info || {});
      
      if (result.data.debug) {
        setStats((prev) => ({ ...prev, ...result.data.debug }));
      }
    } else {
      throw new Error(result.error || "Failed to load more shops");
    }
  } catch (err) {
    console.error("Load more error:", err);
    setError(`Failed to load more shops: ${err.message}`);
  } finally {
    setLoadingMore(false);
  }
};

  const isSmokeShop = (shop) => {
    return shop.found_by_query === "Smoke Shop";
  };

  const isCannabisRetailer = (shop) => {
    return shop.found_by_query && shop.found_by_query.includes("Cannabis");
  };

  const applyFilters = () => {
    console.log("=== APPLYING FILTERS ===");
    console.log("Active filters:", filters);
    console.log("Total shops:", allShops.length);

    const filtered = allShops.filter((shop) => {
      // Smoke shop filter - show ONLY smoke shops when checked
      if (filters.smokeShop && !isSmokeShop(shop)) {
        return false;
      }

      // Cannabis retailer filter - show ONLY cannabis retailers when checked
      if (filters.cannabis && !isCannabisRetailer(shop)) {
        return false;
      }

      // Licensed filter - show only actively licensed shops
      if (filters.licensed && shop.license_status !== "Active") {
        return false;
      }

      // Open now filter - show only currently open shops
      if (filters.openNow && shop.open_now !== true) {
        return false;
      }

      return true;
    });

    console.log("Filtered shops:", filtered.length);
    setFilteredShops(filtered);
  };

  const ShopCard = ({ shop }) => {
    const badges = [];

    const shopIsSmokeShop = isSmokeShop(shop);
    const shopIsCannabis = isCannabisRetailer(shop);

    // Determine primary type badge
    if (shopIsSmokeShop) {
      badges.push({ text: "Smoke Shop", class: "smoke-shop" });
    } else if (shopIsCannabis) {
      badges.push({ text: "Cannabis Retailer", class: "cannabis" });
    } else {
      // Default to cannabis retailer if we can't determine
      badges.push({ text: "Cannabis Retailer", class: "cannabis" });
    }

    // License status badge
    if (shop.license_status === "Active") {
      badges.push({ text: "Licensed", class: "licensed" });
    } else if (shop.license_status && shop.license_status !== "Active") {
      badges.push({ text: "Unlicensed", class: "unlicensed" });
    } else {
      badges.push({ text: "No License Info", class: "no-license" });
    }

    // Open/closed badge
    if (shop.open_now === true) {
      badges.push({ text: "Open Now", class: "open-now" });
    } else if (shop.open_now === false) {
      badges.push({ text: "Closed", class: "closed" });
    }

    return (
      <div className="shop-card">
        {shop.photo_url && (
          <div className="shop-photo">
            <img src={shop.photo_url} alt={shop.name} />
          </div>
        )}

        <div className="shop-header">
          <div>
            <div className="shop-name">{shop.name}</div>
            <div className="rating">
              {shop.rating ? (
                <>
                  <span className="stars">
                    {"★".repeat(Math.floor(shop.rating))}
                  </span>
                  <span>{shop.rating}</span>
                  <span>({shop.user_ratings_total || 0})</span>
                </>
              ) : (
                <span>No ratings</span>
              )}
            </div>
          </div>
          <div className="badges">
            {badges.map((badge, index) => (
              <span key={index} className={`badge ${badge.class}`}>
                {badge.text}
              </span>
            ))}
          </div>
        </div>

        <div className="shop-address">{shop.address}</div>

        {shop.opening_hours &&
          shop.opening_hours.weekday_text &&
          shop.opening_hours.weekday_text.length > 0 && (
            <div className="opening-hours">
              <div className="detail-label">Hours:</div>
              <div className="hours-list">
                {shop.opening_hours.weekday_text
                  .slice(0, 3)
                  .map((hours, index) => (
                    <div key={index} className="hours-item">
                      {hours}
                    </div>
                  ))}
                {shop.opening_hours.weekday_text.length > 3 && (
                  <div className="hours-more">
                    + {shop.opening_hours.weekday_text.length - 3} more days
                  </div>
                )}
              </div>
            </div>
          )}

        <div className="shop-details">
          <div className="detail-item">
            <span className="detail-label">License Status:</span>
            <span className="detail-value">
              {shop.license_status || "Unknown"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Type:</span>
            <span className="detail-value">
              {shopIsSmokeShop
                ? "Smoke Shop"
                : shopIsCannabis
                ? "Cannabis Retailer"
                : "Cannabis Retailer"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value">
              {shop.open_now === true
                ? "🟢 Open"
                : shop.open_now === false
                ? "🔴 Closed"
                : "⚪ Unknown"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Price Level:</span>
            <span className="detail-value">
              {shop.price_level ? "$".repeat(shop.price_level) : "N/A"}
            </span>
          </div>
          {shop.lat && shop.lng && (
            <div className="detail-item">
              <span className="detail-label">Coordinates:</span>
              <span className="detail-value">
                {shop.lat.toFixed(4)}, {shop.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatsPanel = () => {
    const statsData = [
      { label: "Total", value: filteredShops.length },
      {
        label: "Licensed",
        value: allShops.filter((shop) => shop.license_status === "Active")
          .length,
      },
      {
        label: "Open Now",
        value: allShops.filter((shop) => shop.open_now === true).length,
      },
      {
        label: "With Photos",
        value: allShops.filter((shop) => shop.photo_url).length,
      },
    ];

    return (
      <div className={`stats ${showStats ? "show" : ""}`}>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const decorativeDots = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background:
          "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)", // Same as AdminLogin
        minHeight: "100vh",
        color: "#333",
        margin: 0,
        padding: 0,
        width: "100vw",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative geometric elements - same as AdminLogin */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "8%",
          width: "120px",
          height: "120px",
          border: "3px solid rgba(255,255,255,0.15)",
          borderRadius: "20px",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "12%",
          width: "80px",
          height: "80px",
          border: "2px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "80px",
          height: "80px",
          border: "2px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: "6px",
          height: "6px",
          background: "rgba(255,255,255,0.4)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "20%",
          width: "12px",
          height: "12px",
          background: "rgba(255,255,255,0.3)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "5%",
          width: "4px",
          height: "4px",
          background: "rgba(255,255,255,0.5)",
          borderRadius: "50%",
        }}
      />

      {/* Floating dots pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {decorativeDots.map((_, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              background: "rgba(255,255,255,0.3)",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .container { 
          max-width: 1400px; 
          margin: 0 auto; 
          padding: 20px; 
          position: relative;
          z-index: 10;
        }
        
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          color: white;
          position: relative;
          z-index: 10;
        }
        
        .header-logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .header-logo {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          object-fit: cover;
          background: rgba(255,255,255,0.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          backdrop-filter: blur(10px);
        }
        
        .header h1 { 
          font-size: 3.2em; 
          margin: 0; 
          font-weight: 800;
          color: white !important;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          letter-spacing: -2px;
        }
        
        .header p {
          font-size: 1.2em;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
          margin: 0;
          max-width: 500px;
          line-height: 1.5;
          margin: 0 auto;
        }
        
        .search-panel { 
          background: rgba(255,255,255,0.95); 
          padding: 30px; 
          border-radius: 20px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
          margin-bottom: 30px; 
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
          z-index: 10;
        }
        
        .location-toggle {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px; justify-content: center;
        }
        .location-toggle input[type="checkbox"] { width: 18px; height: 18px; accent-color: #10b981; }
        .location-toggle label { font-weight: 600; cursor: pointer; color: #064e3b; }
        
        .search-form { 
          display: grid; gap: 20px; align-items: end; 
        }
        
        .coordinates-form {
          grid-template-columns: 1fr 1fr 1fr 150px;
        }
        
        .location-form {
          grid-template-columns: 1fr 1fr 1fr 150px;
        }
        
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-weight: 600; margin-bottom: 8px; color: #064e3b; }
        .form-group input, .form-group select { 
          padding: 12px 16px; border: 2px solid #e1e5e9; border-radius: 10px; 
          font-size: 16px; transition: all 0.3s ease; 
        }
        .form-group input:focus, .form-group select:focus { 
          outline: none; border-color: #10b981; 
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); 
        }
        .form-group input:disabled, .form-group select:disabled {
          background-color: #f5f5f5; color: #999; cursor: not-allowed;
        }
        
        .radius-container { display: flex; flex-direction: column; align-items: center; }
        .radius-slider { width: 100%; margin: 10px 0; }
        .radius-value { font-weight: bold; color: #10b981; font-size: 18px; }
        
        .search-btn { 
          background: linear-gradient(135deg, #059669 0%, #10b981 100%); 
          color: white; border: none; padding: 12px 24px; border-radius: 10px; 
          font-size: 16px; font-weight: 600; cursor: pointer; 
          transition: all 0.3s ease; transform: translateY(0);
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }
        .search-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 15px rgba(16, 185, 129, 0.4); 
        }
        .search-btn:disabled { 
          opacity: 0.6; cursor: not-allowed; transform: translateY(0); 
        }
        
        .load-more-btn {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white; border: none; padding: 15px 30px; border-radius: 10px;
          font-size: 16px; font-weight: 600; cursor: pointer;
          transition: all 0.3s ease; margin: 30px auto; display: block;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }
        .load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(16, 185, 129, 0.4);
        }
        .load-more-btn:disabled {
          opacity: 0.6; cursor: not-allowed; transform: translateY(0);
        }
        
        .filters { 
          background: rgba(255,255,255,0.95); 
          padding: 20px; 
          border-radius: 15px; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
          margin-bottom: 30px; 
          display: none;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
          z-index: 10;
        }
        .filters.show { display: block; animation: slideDown 0.3s ease; }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .filters h3 { margin-bottom: 15px; color: #064e3b; }
        .filter-group { display: flex; gap: 30px; flex-wrap: wrap; }
        .filter-item { display: flex; align-items: center; gap: 8px; }
        .filter-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: #10b981; }
        .filter-item label { font-weight: 500; cursor: pointer; color: #064e3b; }
        
        .stats { 
          background: rgba(255,255,255,0.95); 
          padding: 20px; 
          border-radius: 15px; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
          margin-bottom: 30px; 
          display: none;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
          z-index: 10;
        }
        .stats.show { display: block; }
        .stats-grid { 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
          gap: 15px; margin-bottom: 15px;
        }
        .stat-item { 
          text-align: center; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 10px; 
        }
        .stat-number { 
          font-size: 2em; font-weight: 700; color: #10b981; margin-bottom: 5px; 
        }
        .stat-label { 
          font-size: 12px; color: #064e3b; text-transform: uppercase; font-weight: 600; 
        }
        
        .results { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
          gap: 25px;
          position: relative;
          z-index: 10;
        }
        
        .shop-card { 
          background: rgba(255,255,255,0.95); 
          border-radius: 15px; 
          padding: 0; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.15); 
          transition: all 0.3s ease; 
          position: relative; 
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .shop-card::before { 
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; 
          background: linear-gradient(90deg, #10b981, #059669); z-index: 1;
        }
        .shop-card:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 15px 35px rgba(0,0,0,0.2); 
        }
        
        /* Rest of your existing styles... */
        .shop-photo {
          width: 100%; height: 200px; overflow: hidden;
        }
        .shop-photo img {
          width: 100%; height: 100%; object-fit: cover;
        }
        
        .shop-header { 
          display: flex; justify-content: space-between; 
          align-items: flex-start; margin-bottom: 15px; padding: 25px 25px 0 25px;
        }
        .shop-name { 
          font-size: 1.3em; font-weight: 700; color: #064e3b; margin-bottom: 5px; 
        }
        .badges { display: flex; flex-direction: column; gap: 5px; }
        .badge { 
          padding: 4px 12px; border-radius: 20px; font-size: 12px; 
          font-weight: 600; text-align: center; min-width: 80px; 
        }
        .badge.smoke-shop { background: #ff6b6b; color: white; }
        .badge.cannabis { background: #10b981; color: white; }
        .badge.licensed { background: #059669; color: white; }
        .badge.unlicensed { background: #ffd43b; color: #333; }
        .badge.no-license { background: #e9ecef; color: #666; }
        .badge.matched { background: #845ec2; color: white; }
        .badge.open-now { background: #10b981; color: white; }
        .badge.closed { background: #ff6b6b; color: white; }
        
        .shop-address { 
          color: #666; margin-bottom: 15px; font-size: 14px; line-height: 1.4; 
          padding: 0 25px;
        }
        
        .opening-hours {
          margin-bottom: 15px; padding: 0 25px;
        }
        .opening-hours .detail-label {
          font-weight: 600; color: #064e3b; margin-bottom: 8px;
        }
        .hours-list {
          background: #f8f9fa; padding: 12px; border-radius: 8px;
        }
        .hours-item {
          font-size: 12px; color: #666; margin-bottom: 4px;
        }
        .hours-item:last-child {
          margin-bottom: 0;
        }
        .hours-more {
          font-size: 11px; color: #999; font-style: italic; margin-top: 4px;
        }
        
        .shop-details { 
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; 
          padding: 0 25px 25px 25px;
        }
        .detail-item { 
          display: flex; justify-content: space-between; padding: 8px 0; 
          border-bottom: 1px solid #f1f3f5; 
        }
        .detail-label { font-weight: 600; color: #064e3b; }
        .detail-value { color: #333; }
        
        .rating { display: flex; align-items: center; gap: 5px; }
        .stars { color: #ffd43b; }
        
        .loading { 
          text-align: center; 
          padding: 60px 0; 
          color: white;
          position: relative;
          z-index: 10;
        }
        .loading-spinner { 
          width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.3); 
          border-top: 4px solid white; border-radius: 50%; 
          animation: spin 1s linear infinite; margin: 0 auto 20px; 
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error { 
          background: rgba(255, 107, 107, 0.9); 
          color: white; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 20px 0; 
          text-align: center;
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 10;
        }
        
        @media (max-width: 768px) {
          .coordinates-form, .location-form { grid-template-columns: 1fr; gap: 15px; }
          .filter-group { flex-direction: column; gap: 15px; }
          .results { grid-template-columns: 1fr; }
          .shop-details { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="header-logo-section">
            <img src={canojaLogo} alt="Canoja Logo" className="header-logo" />
            <div>
              <h1 style={titleStyles}>Canoja</h1>
            </div>
          </div>
          <p>Find smoke shops and cannabis retailers near you</p>
        </div>

        <div className="search-panel">
          <div className="location-toggle">
            <input
              type="checkbox"
              id="useCoordinates"
              name="useCoordinates"
              checked={locationData.useCoordinates}
              onChange={handleLocationChange}
            />
            <label htmlFor="useCoordinates">Use Coordinates (GPS)</label>
          </div>

          <form
            className={`search-form ${
              locationData.useCoordinates ? "coordinates-form" : "location-form"
            }`}
            onSubmit={handleSearchShops}
          >
            {locationData.useCoordinates ? (
              <>
                <div className="form-group">
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    id="latitude"
                    step="any"
                    placeholder="e.g., 40.7128"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    id="longitude"
                    step="any"
                    placeholder="e.g., -74.0060"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>State</label>
                  <select
                    name="state"
                    value={locationData.state}
                    onChange={handleLocationChange}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.nameAbbr} value={state.nameAbbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
  <label>City</label>
  <select
    name="city"
    value={locationData.city}
    onChange={handleLocationChange}
    disabled={!locationData.state}
  >
    <option value="">Select City</option>
    {cities.map((city) => (
      <option key={city.name} value={city.name}>
        {city.name}
      </option>
    ))}
  </select>
</div>

                <div className="form-group">
                  <label>ZIP Code</label>
                  <select
                    name="zipCode"
                    value={locationData.zipCode}
                    onChange={handleLocationChange}
                    disabled={!locationData.city}
                  >
                    <option value="">Select ZIP</option>
                    {zips.map((zip) => (
                      <option key={zip} value={zip}>
                        {zip}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {locationData.useCoordinates && (
              <div className="form-group">
                <label htmlFor="radius">Search Radius</label>
                <div className="radius-container">
                  <input
                    type="range"
                    name="radius"
                    id="radius"
                    className="radius-slider"
                    min="1000"
                    max="100000"
                    value={formData.radius}
                    step="500"
                    onChange={handleInputChange}
                  />
                  <div className="radius-value">
                    <span>{(formData.radius / 1000).toFixed(1)}</span> km
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        <StatsPanel />

        <div className={`filters ${showFilters ? "show" : ""}`}>
          <h3>Filters</h3>
          <div className="filter-group">
            <div className="filter-item">
              <input
                type="checkbox"
                id="smokeShopFilter"
                name="smokeShop"
                checked={filters.smokeShop}
                onChange={handleFilterChange}
              />
              <label htmlFor="smokeShopFilter">Smoke Shops Only</label>
            </div>
            <div className="filter-item">
              <input
                type="checkbox"
                id="cannabisFilter"
                name="cannabis"
                checked={filters.cannabis}
                onChange={handleFilterChange}
              />
              <label htmlFor="cannabisFilter">Cannabis Retailers Only</label>
            </div>
            <div className="filter-item">
              <input
                type="checkbox"
                id="licensedFilter"
                name="licensed"
                checked={filters.licensed}
                onChange={handleFilterChange}
              />
              <label htmlFor="licensedFilter">Licensed Only</label>
            </div>
            <div className="filter-item">
              <input
                type="checkbox"
                id="openNowFilter"
                name="openNow"
                checked={filters.openNow}
                onChange={handleFilterChange}
              />
              <label htmlFor="openNowFilter">Open Now</label>
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Searching for shops...</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <div className="results">
          {filteredShops.length === 0 && allShops.length > 0 && (
            <div className="error">No shops found matching your criteria.</div>
          )}
          {filteredShops.map((shop, index) => (
            <ShopCard key={shop.place_id || index} shop={shop} />
          ))}
        </div>

        {pagination.has_more && !loading && (
          <button
            className="load-more-btn"
            onClick={handleLoadMoreShops}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <div
                  className="loading-spinner"
                  style={{
                    width: "20px",
                    height: "20px",
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                ></div>
                Loading More...
              </>
            ) : (
              `Load More Shops`
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopFinder;
