import axios from "axios";

const envBase = import.meta.env?.VITE_API_BASE_URL as string | undefined;
const baseURL = envBase ?? "https://localhost/api";
console.log("this is my url ", baseURL);
const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
