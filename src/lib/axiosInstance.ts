import axios from 'axios';
import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { ChromeAuth } from '../utils/ChromeAuth';

// 기본 axios 인스턴스 생성
const axiosInterface = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInterface.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 토큰이 필요 없는 요청들
    const publicPaths = ['/auth/login', '/auth/register', '/auth/refresh'];
    const isPublicPath = publicPaths.some((path) => config.url?.includes(path));

    if (!isPublicPath) {
      const token = await ChromeAuth.getToken();
      if (!token) {
        handleAutoLogout();
        window.location.hash = '/login';
      }
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInterface.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 오류이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('401 오류 감지, 토큰 갱신 시도...');

        // 새 토큰 가져오기 (background.js에서 자동 갱신)
        const newToken = await ChromeAuth.getToken();

        if (newToken && originalRequest.headers) {
          console.log('새 토큰으로 재시도');
          // 새 토큰으로 헤더 업데이트
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // 원래 요청 재시도
          return axiosInterface(originalRequest);
        } else {
          console.log('토큰 갱신 실패, 자동 로그아웃');
          // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
          handleAutoLogout();
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        handleAutoLogout();
      }
    }

    return Promise.reject(error);
  }
);

// 자동 로그아웃 처리
function handleAutoLogout(): void {
  console.log('자동 로그아웃 처리');

  // 커스텀 이벤트 발생 (React 컴포넌트에서 수신)
  window.dispatchEvent(
    new CustomEvent('auth:logout', {
      detail: { reason: 'token_refresh_failed' },
    })
  );

  // 필요시 추가 처리 (로그인 페이지로 리다이렉트 등)
}

export default axiosInterface;
