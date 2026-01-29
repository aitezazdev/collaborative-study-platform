import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log(" [AXIOS REQUEST] No token found in localStorage");
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios interceptor error:", error.response?.status);
    
    if (error.response?.status === 401) {
      console.log("Token might be invalid or expired");
    }
    
    return Promise.reject(error);
  }
);

export default instance;