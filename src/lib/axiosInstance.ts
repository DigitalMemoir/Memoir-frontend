import axios from 'axios';
import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { ChromeAuth } from '../utils/ChromeAuth';

// 싱글톤 패턴으로 axios 인스턴스 관리
class AxiosManager {
  private static instance: AxiosManager | null = null;
  private axiosInstance: any = null;
  private isInitialized = false;
  private requestInterceptorId: number | null = null;
  private responseInterceptorId: number | null = null;

  private constructor() {
    console.log('=== AxiosManager 생성자 호출 ===');
    this.initializeAxios();
  }

  static getInstance(): AxiosManager {
    if (!AxiosManager.instance) {
      console.log('=== 새 AxiosManager 인스턴스 생성 ===');
      AxiosManager.instance = new AxiosManager();
    } else {
      console.log('=== 기존 AxiosManager 인스턴스 반환 ===');
    }
    return AxiosManager.instance;
  }

  private initializeAxios() {
    if (this.isInitialized) {
      console.log('=== Axios 이미 초기화됨 - 스킵 ===');
      return;
    }

    console.log('=== Axios 인스턴스 초기화 시작 ===');

    // 기본 axios 인스턴스 생성
    this.axiosInstance = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}`,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 기존 인터셉터 제거 (혹시나 해서)
    if (this.requestInterceptorId !== null) {
      this.axiosInstance.interceptors.request.eject(this.requestInterceptorId);
    }
    if (this.responseInterceptorId !== null) {
      this.axiosInstance.interceptors.response.eject(
        this.responseInterceptorId
      );
    }

    // 요청 인터셉터 등록
    this.requestInterceptorId = this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const requestId = Math.random().toString(36).substr(2, 9);
        config.headers['X-Request-ID'] = requestId;

        console.log(
          `=== [${requestId}] API 요청 시작: ${config.method?.toUpperCase()} ${config.url} ===`
        );

        try {
          // Background script 연결 대기
          await AxiosInitializer.ensureBackgroundReady();

          // 토큰이 필요 없는 요청들
          const publicPaths = [
            '/auth/login',
            '/auth/register',
            '/auth/refresh',
          ];
          const isPublicPath = publicPaths.some((path) =>
            config.url?.includes(path)
          );

          if (!isPublicPath) {
            console.log(
              `[${requestId}] 토큰이 필요한 요청 - 토큰 가져오기 시도`
            );

            try {
              const token = await ChromeAuth.getToken();

              if (!token) {
                console.warn(
                  `[${requestId}] 토큰이 없습니다. 로그인 페이지로 이동합니다.`
                );
                handleAutoLogout();
                return Promise.reject(new Error('No token available'));
              }

              if (config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log(`[${requestId}] 토큰 헤더 추가 완료`);
              }
            } catch (error) {
              console.error(`[${requestId}] 토큰 가져오기 실패:`, error);
              handleAutoLogout();
              return Promise.reject(error);
            }
          } else {
            console.log(`[${requestId}] 공개 경로 요청 - 토큰 불필요`);
          }

          console.log(`[${requestId}] 요청 준비 완료`);
          return config;
        } catch (error) {
          console.error(`[${requestId}] 요청 인터셉터 오류:`, error);
          return Promise.reject(error);
        }
      },
      (error: AxiosError) => {
        console.error('요청 인터셉터 에러:', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터 등록
    this.responseInterceptorId = this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestId = response.config.headers['X-Request-ID'];
        console.log(
          `=== [${requestId}] API 응답 성공: ${response.status} ${response.config.url} ===`
        );
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };
        const requestId = originalRequest?.headers['X-Request-ID'];

        console.log(
          `=== [${requestId}] API 응답 오류: ${error.response?.status} ${originalRequest?.url} ===`
        );

        // 401 오류이고 재시도하지 않은 요청인 경우
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          console.log(`[${requestId}] 401 오류 감지 - 토큰 갱신 시도...`);

          try {
            console.log(`[${requestId}] 토큰 갱신 대기 중...`);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newToken = await ChromeAuth.getToken();

            if (newToken && originalRequest.headers) {
              console.log(`[${requestId}] 새 토큰으로 재시도`);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              // 원래 요청 재시도
              return this.axiosInstance(originalRequest);
            } else {
              console.log(`[${requestId}] 토큰 갱신 실패 - 자동 로그아웃`);
              handleAutoLogout();
            }
          } catch (refreshError) {
            console.error(`[${requestId}] 토큰 갱신 실패:`, refreshError);
            handleAutoLogout();
          }
        } else if (
          error.response?.status === 401 &&
          originalRequest &&
          originalRequest._retry
        ) {
          console.error(
            `[${requestId}] 토큰 갱신 후에도 401 오류 발생 - 자동 로그아웃 처리`
          );
          handleAutoLogout();
          return Promise.reject(new Error('Token refresh failed, logged out'));
        }

        console.error(`[${requestId}] API 오류:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: originalRequest?.url,
          message: error.message,
        });

        return Promise.reject(error);
      }
    );

    this.isInitialized = true;
    console.log('=== Axios 인스턴스 초기화 완료 ===');
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }

  // 디버깅용 - 인터셉터 정보 확인
  getInterceptorInfo() {
    return {
      requestInterceptorId: this.requestInterceptorId,
      responseInterceptorId: this.responseInterceptorId,
      requestInterceptorsCount:
        this.axiosInstance?.interceptors.request.handlers?.length || 0,
      responseInterceptorsCount:
        this.axiosInstance?.interceptors.response.handlers?.length || 0,
    };
  }
}

// Background script 초기화 상태 관리
class AxiosInitializer {
  private static isBackgroundReady = false;
  private static initializationPromise: Promise<void> | null = null;
  private static maxInitializationTime = 10000;

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

    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.log('Chrome Extension 환경이 아님 - 스킵');
      this.isBackgroundReady = true;
      return;
    }

    const startTime = Date.now();

    try {
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
        this.isBackgroundReady = true;
      }
    } catch (error) {
      const elapsed = Date.now() - startTime;
      console.error(`Background 연결 중 오류 (${elapsed}ms):`, error);
      this.isBackgroundReady = true;
    }

    console.log('=== Axios Background 연결 완료 ===');
  }

  static resetInitialization(): void {
    this.isBackgroundReady = false;
    this.initializationPromise = null;
    console.log('AxiosInitializer 상태 리셋');
  }
}

// 자동 로그아웃 처리
function handleAutoLogout(): void {
  console.log('=== 자동 로그아웃 처리 시작 ===');

  try {
    ChromeAuth.logout().catch((error) => {
      console.error('Background 로그아웃 실패:', error);
    });

    window.dispatchEvent(
      new CustomEvent('auth:logout', {
        detail: {
          reason: 'token_refresh_failed',
          timestamp: Date.now(),
        },
      })
    );

    setTimeout(() => {
      console.log('로그인 페이지로 리다이렉트');
      window.location.hash = '/login';
    }, 100);
  } catch (error) {
    console.error('자동 로그아웃 처리 중 오류:', error);
    setTimeout(() => {
      window.location.hash = '/login';
    }, 500);
  }

  console.log('=== 자동 로그아웃 처리 완료 ===');
}

// 싱글톤 인스턴스 가져오기
const axiosManager = AxiosManager.getInstance();
const axiosInterface = axiosManager.getAxiosInstance();

// 디버깅을 위한 전역 함수들
if (import.meta.env.DEV) {
  (window as any).debugAxios = {
    resetInitialization: () => {
      AxiosInitializer.resetInitialization();
      ChromeAuth.resetInitialization();
    },
    checkConnection: () => ChromeAuth.checkConnection(),
    getToken: () => ChromeAuth.getToken(),
    getStatus: () => ChromeAuth.getStatus(),
    getInterceptorInfo: () => axiosManager.getInterceptorInfo(),
  };
}

export default axiosInterface;
