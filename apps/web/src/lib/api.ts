import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken || config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const refreshSuccessful = await useAuthStore.getState().refreshToken();
        
        if (refreshSuccessful && originalRequest.headers) {
          const newToken = useAuthStore.getState().accessToken;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return api(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  export default api;


