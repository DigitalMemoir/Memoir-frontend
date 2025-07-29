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
  type: 'GET_TOKEN' | 'SAVE_TOKENS' | 'LOGOUT' | 'CHECK_STATUS';
  tokens?: TokenPair;
}

export interface ChromeResponse {
  success?: boolean;
  token?: string | null;
  status?: TokenStatus;
  error?: string;
}
