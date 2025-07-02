import axios from 'axios';

let axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default axiosInstance;
