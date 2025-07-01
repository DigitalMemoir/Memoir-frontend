import axios from 'axios';

export const getAccessTokenFromCookie = (): string | null => {
  const match = document.cookie.match(/(^| )accessToken=([^;]+)/);
  return match ? match[2] : null;
};

let axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: false,
});

const attachAuthInterceptor = () => {
  axiosInstance.interceptors.request.use((config) => {
    const token = getAccessTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

attachAuthInterceptor();

export default axiosInstance;
