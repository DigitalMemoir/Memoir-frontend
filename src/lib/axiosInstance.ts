import axios from 'axios';
import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { ChromeAuth } from '../utils/ChromeAuth';

// Background script 초기화 상태 관리
class AxiosInitializer {
  private static isBackgroundReady = false;
  private static initializationPromise: Promise<void> | null = null;
  private static maxInitializationTime = 10000; // 10초

  static async ensureBackgroundReady(): Promise<void> {
    if (this.isBackgroundReady) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._waitForBackground();
    return this.initializationPromise;
  }

  private static async _waitForBackground(): Promise<void> {
    console.log('=== Axios Background 연결 시작 ===');

    // Chrome Extension 환경이 아니면 바로 완료
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.log('Chrome Extension 환경이 아님 - 스킵');
      this.isBackgroundReady = true;
      return;
    }

    const startTime = Date.now();

    try {
      // ChromeAuth의 연결 확인 기능 활용
      const isConnected = await Promise.race([
        ChromeAuth.checkConnection(),
        new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.log('Background 연결 타임아웃');
            resolve(false);
          }, this.maxInitializationTime);
        }),
      ]);

      const elapsed = Date.now() - startTime;

      if (isConnected) {
        console.log(`Background 연결 성공 (${elapsed}ms)`);
        this.isBackgroundReady = true;
      } else {
        console.warn(`Background 연결 실패 (${elapsed}ms) - 계속 진행`);
        this.isBackgroundReady = true; // 실패해도 진행
      }
    } catch (error) {
      const elapsed = Date.now() - startTime;
      console.error(`Background 연결 중 오류 (${elapsed}ms):`, error);
      this.isBackgroundReady = true; // 오류가 있어도 진행
    }

    console.log('=== Axios Background 연결 완료 ===');
  }

  // 초기화 상태 리셋 (디버깅용)
  static resetInitialization(): void {
    this.isBackgroundReady = false;
    this.initializationPromise = null;
    console.log('AxiosInitializer 상태 리셋');
  }
}

// 기본 axios 인스턴스 생성
const axiosInterface = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 15000, // 15초로 증가
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInterface.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(
      `=== API 요청 시작: ${config.method?.toUpperCase()} ${config.url} ===`
    );

    try {
      // 먼저 Background script가 준비될 때까지 대기
      await AxiosInitializer.ensureBackgroundReady();

      // 토큰이 필요 없는 요청들
      const publicPaths = ['/auth/login', '/auth/register', '/auth/refresh'];
      const isPublicPath = publicPaths.some((path) =>
        config.url?.includes(path)
      );

      if (!isPublicPath) {
        console.log('토큰이 필요한 요청 - 토큰 가져오기 시도');

        try {
          const token = await ChromeAuth.getToken();

          if (!token) {
            console.warn('토큰이 없습니다. 로그인 페이지로 이동합니다.');
            handleAutoLogout();
            return Promise.reject(new Error('No token available'));
          }

          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('토큰 헤더 추가 완료');
          }
        } catch (error) {
          console.error('토큰 가져오기 실패:', error);
          handleAutoLogout();
          return Promise.reject(error);
        }
      } else {
        console.log('공개 경로 요청 - 토큰 불필요');
      }

      console.log('요청 준비 완료');
      return config;
    } catch (error) {
      console.error('요청 인터셉터 오류:', error);
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    console.error('요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInterface.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `=== API 응답 성공: ${response.status} ${response.config.url} ===`
    );
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    console.log(
      `=== API 응답 오류: ${error.response?.status} ${originalRequest?.url} ===`
    );

    // 401 오류이고 재시도하지 않은 요청인 경우
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      console.log('401 오류 감지 - 토큰 갱신 시도...');

      try {
        // Background script에서 자동으로 토큰 갱신을 시도하므로
        // 잠시 대기 후 새 토큰을 가져온다
        console.log('토큰 갱신 대기 중...');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newToken = await ChromeAuth.getToken();

        if (newToken && originalRequest.headers) {
          console.log('새 토큰으로 재시도');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // 원래 요청 재시도
          return axiosInterface(originalRequest);
        } else {
          console.log('토큰 갱신 실패 - 자동 로그아웃');
          handleAutoLogout();
        }
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        handleAutoLogout();
      }
    }

    // 다른 오류들은 그대로 전파
    console.error('API 오류:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: originalRequest?.url,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

// 자동 로그아웃 처리
function handleAutoLogout(): void {
  console.log('=== 자동 로그아웃 처리 시작 ===');

  try {
    // Background에도 로그아웃 알림
    ChromeAuth.logout().catch((error) => {
      console.error('Background 로그아웃 실패:', error);
    });

    // 커스텀 이벤트 발생 (React 컴포넌트에서 수신)
    window.dispatchEvent(
      new CustomEvent('auth:logout', {
        detail: {
          reason: 'token_refresh_failed',
          timestamp: Date.now(),
        },
      })
    );

    // 로그인 페이지로 리다이렉트
    setTimeout(() => {
      console.log('로그인 페이지로 리다이렉트');
      window.location.hash = '/login';
    }, 100);
  } catch (error) {
    console.error('자동 로그아웃 처리 중 오류:', error);

    // 최후의 수단으로 강제 리다이렉트
    setTimeout(() => {
      window.location.hash = '/login';
    }, 500);
  }

  console.log('=== 자동 로그아웃 처리 완료 ===');
}

// 디버깅을 위한 전역 함수들 (개발 환경에서만)
if (import.meta.env.DEV) {
  (window as any).debugAxios = {
    resetInitialization: () => {
      AxiosInitializer.resetInitialization();
      ChromeAuth.resetInitialization();
    },
    checkConnection: () => ChromeAuth.checkConnection(),
    getToken: () => ChromeAuth.getToken(),
    getStatus: () => ChromeAuth.getStatus(),
  };
}

export default axiosInterface;
