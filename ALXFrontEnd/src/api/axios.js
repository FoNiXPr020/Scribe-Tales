import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
  withCredentials: true,
  withXSRFToken: true
});

axiosClient.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('AuthToken');
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

export default axiosClient;