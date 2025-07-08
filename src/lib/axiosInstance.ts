import axios from 'axios';
import useLocalStorage from '../hooks/useLocalStorage';

let axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useLocalStorage().get<string>('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
