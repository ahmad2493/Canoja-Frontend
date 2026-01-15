import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

// Environment configuration
const apiBaseUrl = "http://localhost:5000/api";
// const apiBaseUrl = "http://54.227.140.191/api";

// Token helpers
export const setToken = (token) => localStorage.setItem("jwt", token);
export const getToken = () => localStorage.getItem("jwt");
export const removeToken = () => localStorage.removeItem("jwt");

// Create axios instance
const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - add JWT token and handle FormData
api.interceptors.request.use((config) => {
  const token = getToken();
  //console.log("Token being sent:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If data is FormData, remove Content-Type header to let axios set it automatically with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  
  return config;
});

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication failed - token may be expired');
    }
    return Promise.reject(error);
  }
);

// Shop finder functions
export const searchShops = async (searchPayload) => {
  try {
    const response = await api.post("/shops/compare-shops", searchPayload);
    return response.data;
  } catch (error) {
    console.error("Search shops failed", error);
    throw error;
  }
};

export const loadMoreShops = async (searchPayload) => {
  try {
    const response = await api.post("/shops/compare-shops/more", searchPayload);
    return response.data;
  } catch (error) {
    console.error("Load more shops failed", error);
    throw error;
  }
};

export const useSearchShops = () =>
  useMutation({
    mutationFn: (searchPayload) => searchShops(searchPayload),
  });

export const useLoadMoreShops = () =>
  useMutation({
    mutationFn: (searchPayload) => loadMoreShops(searchPayload),
  });


export default api;