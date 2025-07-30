export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenStatus {
  isLoggedIn: boolean;
  daysLeft?: number;
  willExpireSoon?: boolean;
}

export interface ChromeMessage {
  type: 'GET_TOKEN' | 'SAVE_TOKENS' | 'LOGOUT' | 'CHECK_STATUS' | 'PING';
  tokens?: TokenPair;
  timestamp?: number; // 메시지 전송 시간 (디버깅용)
}

export interface ChromeResponse {
  success: boolean;
  token?: string | null;
  status?: TokenStatus;
  error?: string;
  ready?: boolean; // PING 응답용 - background script 준비 상태
  timestamp?: number; // 응답 시간 (디버깅용)
}

// Background script에서 프론트엔드로 보내는 알림 메시지 타입
export interface BackgroundNotification {
  type: 'TOKEN_REFRESHED' | 'AUTO_LOGOUT';
  timestamp: number;
}

// 자동 로그아웃 이벤트 상세 정보
export interface LogoutEventDetail {
  reason: 'token_refresh_failed' | 'manual_logout' | 'token_expired';
  timestamp: number;
}

// ChromeAuth 초기화 상태
export interface AuthInitializationState {
  isInitialized: boolean;
  isBackgroundReady: boolean;
  lastConnectionCheck?: number;
  connectionRetries: number;
}

// 디버깅용 타입
export interface DebugAxiosInterface {
  resetInitialization: () => void;
  checkConnection: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  getStatus: () => Promise<TokenStatus>;
  forceLogout: () => Promise<boolean>;
}

// Window 객체 확장 (디버깅용)
declare global {
  interface Window {
    debugAxios?: DebugAxiosInterface;
  }
}
