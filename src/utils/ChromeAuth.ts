import type {
  TokenPair,
  TokenStatus,
  ChromeMessage,
  ChromeResponse,
} from '../types/IAuth';

export class ChromeAuth {
  // Chrome Extension 환경 체크
  private static isChromeExtension(): boolean {
    return (
      typeof chrome !== 'undefined' &&
      !!chrome.runtime &&
      typeof chrome.runtime.sendMessage === 'function'
    );
  }

  // Background에게 "토큰 줘" 요청
  static async getToken(): Promise<string | null> {
    if (!this.isChromeExtension()) {
      console.warn('Chrome Extension 환경이 아닙니다.');
      return null;
    }

    return new Promise<string | null>((resolve) => {
      const message: ChromeMessage = { type: 'GET_TOKEN' };

      chrome.runtime.sendMessage(message, (response: ChromeResponse) => {
        if (chrome.runtime.lastError) {
          console.error('토큰 가져오기 실패:', chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(response?.token || null);
        }
      });
    });
  }

  // Background에게 "토큰 저장해줘" 요청
  static async saveTokens(tokens: TokenPair): Promise<boolean> {
    if (!this.isChromeExtension()) {
      console.warn('Chrome Extension 환경이 아닙니다.');
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const message: ChromeMessage = {
        type: 'SAVE_TOKENS',
        tokens,
      };

      chrome.runtime.sendMessage(message, (response: ChromeResponse) => {
        if (chrome.runtime.lastError) {
          console.error('토큰 저장 실패:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(response?.success || false);
        }
      });
    });
  }

  // Background에게 "로그아웃해줘" 요청
  static async logout(): Promise<boolean> {
    if (!this.isChromeExtension()) {
      console.warn('Chrome Extension 환경이 아닙니다.');
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const message: ChromeMessage = { type: 'LOGOUT' };

      chrome.runtime.sendMessage(message, (response: ChromeResponse) => {
        if (chrome.runtime.lastError) {
          console.error('로그아웃 실패:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(response?.success || false);
        }
      });
    });
  }

  // Background에게 "상태 알려줘" 요청
  static async getStatus(): Promise<TokenStatus> {
    if (!this.isChromeExtension()) {
      return { isLoggedIn: false };
    }

    return new Promise<TokenStatus>((resolve) => {
      const message: ChromeMessage = { type: 'CHECK_STATUS' };

      chrome.runtime.sendMessage(message, (response: ChromeResponse) => {
        if (chrome.runtime.lastError) {
          console.error('상태 확인 실패:', chrome.runtime.lastError);
          resolve({ isLoggedIn: false });
        } else {
          resolve(response?.status || { isLoggedIn: false });
        }
      });
    });
  }
}
