import axios from 'axios';

let axiosInstance = axios.create({
  baseURL: '/back-api',
  withCredentials: true,
});

export default axiosInstance;
