import axios from "axios";

// Standardize API requests to use relative endpoints on the current server
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const baseURL = (backendUrl && !backendUrl.includes("localhost") && backendUrl.startsWith("http"))
  ? backendUrl
  : "";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

export default api;
