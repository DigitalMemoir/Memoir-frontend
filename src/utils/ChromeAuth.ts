import type {
  TokenPair,
  TokenStatus,
  ChromeMessage,
  ChromeResponse,
} from '../types/IAuth';

export class ChromeAuth {
  private static isInitialized = false;
  private static initializationPromise: Promise<boolean> | null = null;

  // Chrome Extension 환경 체크
  private static isChromeExtension(): boolean {
    return (
      typeof chrome !== 'undefined' &&
      !!chrome.runtime &&
      typeof chrome.runtime.sendMessage === 'function'
    );
  }

  // 한 번만 초기화하는 헬퍼 함수
  private static async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  private static async _performInitialization(): Promise<boolean> {
    console.log('ChromeAuth 초기화 시작...');

    if (!this.isChromeExtension()) {
      console.warn('Chrome Extension 환경이 아닙니다.');
      this.isInitialized = true;
      return false;
    }

    const isReady = await this.waitForBackgroundScript();
    this.isInitialized = true;

    if (isReady) {
      console.log('ChromeAuth 초기화 완료');
    } else {
      console.warn('Background script 연결 실패했지만 초기화 완료로 처리');
    }

    return isReady;
  }

  // Background script가 준비될 때까지 대기하는 헬퍼 함수
  private static async waitForBackgroundScript(
    maxRetries = 5,
    baseDelay = 300
  ): Promise<boolean> {
    console.log('Background script 연결 대기 중...');

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`Background script 연결 시도 ${i + 1}/${maxRetries}`);

        const isReady = await new Promise<boolean>((resolve) => {
          const timeout = setTimeout(() => {
            console.log(`연결 시도 ${i + 1} 타임아웃`);
            resolve(false);
          }, 2000);

          try {
            chrome.runtime.sendMessage(
              { type: 'PING', timestamp: Date.now() },
              (response) => {
                clearTimeout(timeout);

                if (chrome.runtime.lastError) {
                  console.log(
                    `연결 시도 ${i + 1} 실패:`,
                    chrome.runtime.lastError.message
                  );
                  resolve(false);
                } else {
                  console.log(`연결 시도 ${i + 1} 응답:`, response);
                  const isValid =
                    response &&
                    response.success === true &&
                    response.ready === true;
                  resolve(isValid);
                }
              }
            );
          } catch (error) {
            clearTimeout(timeout);
            console.log(`연결 시도 ${i + 1} 예외:`, error);
            resolve(false);
          }
        });

        if (isReady) {
          console.log('Background script 연결 성공');
          return true;
        }
      } catch (error) {
        console.log(`Background script 연결 시도 ${i + 1} 오류:`, error);
      }

      // 마지막 시도가 아니면 대기
      if (i < maxRetries - 1) {
        const delay = baseDelay * (i + 1);
        console.log(`${delay}ms 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.warn('Background script 연결 시간 초과');
    return false;
  }

  // 재시도 로직이 포함된 안전한 메시지 전송
  private static async sendMessageSafely<T>(
    message: ChromeMessage,
    maxRetries = 3,
    baseDelay = 200
  ): Promise<T | null> {
    // 초기화 확인
    const isInitialized = await this.initialize();
    if (!isInitialized) {
      console.warn('ChromeAuth가 초기화되지 않았습니다.');
      return null;
    }

    // 메시지 검증
    if (!message || !message.type) {
      console.error('잘못된 메시지 형식:', message);
      return null;
    }

    console.log('메시지 전송 시작:', message.type);

    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await new Promise<T | null>((resolve) => {
          const timeout = setTimeout(() => {
            console.log(`메시지 전송 타임아웃 (시도 ${i + 1}/${maxRetries})`);
            resolve(null);
          }, 3000);

          try {
            chrome.runtime.sendMessage(
              { ...message, timestamp: Date.now() },
              (response: ChromeResponse) => {
                clearTimeout(timeout);

                if (chrome.runtime.lastError) {
                  console.log(
                    `메시지 전송 실패 (시도 ${i + 1}/${maxRetries}):`,
                    chrome.runtime.lastError.message
                  );
                  resolve(null);
                } else {
                  console.log(
                    `메시지 전송 성공 (시도 ${i + 1}/${maxRetries}):`,
                    response
                  );

                  // 응답 검증
                  if (!response) {
                    console.warn('빈 응답 수신');
                    resolve(null);
                  } else if (response.success === false) {
                    console.warn('실패 응답:', response.error);
                    resolve(null);
                  } else {
                    resolve(response as T);
                  }
                }
              }
            );
          } catch (error) {
            clearTimeout(timeout);
            console.error(
              `메시지 전송 예외 (시도 ${i + 1}/${maxRetries}):`,
              error
            );
            resolve(null);
          }
        });

        // 성공하면 바로 반환
        if (result !== null) {
          return result;
        }
      } catch (error) {
        console.error(`메시지 전송 시도 ${i + 1} 실패:`, error);
      }

      // 마지막 시도가 아니면 대기
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i); // 지수 백오프
        console.log(`${delay}ms 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.error(`메시지 전송 최종 실패: ${message.type}`);
    return null;
  }

  // Background에게 "토큰 줘" 요청
  static async getToken(): Promise<string | null> {
    try {
      console.log('토큰 요청 시작');

      const response = await this.sendMessageSafely<ChromeResponse>({
        type: 'GET_TOKEN',
      });

      if (response && response.success) {
        const token = response.token || null;
        console.log('토큰 요청 완료:', token ? '토큰 있음' : '토큰 없음');
        return token;
      }

      console.warn('토큰 요청 실패:', response);
      return null;
    } catch (error) {
      console.error('토큰 요청 중 오류:', error);
      return null;
    }
  }

  // Background에게 "토큰 저장해줘" 요청
  static async saveTokens(tokens: TokenPair): Promise<boolean> {
    try {
      console.log('토큰 저장 요청 시작');

      // 토큰 데이터 검증
      if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        console.error('잘못된 토큰 데이터:', tokens);
        return false;
      }

      const response = await this.sendMessageSafely<ChromeResponse>({
        type: 'SAVE_TOKENS',
        tokens,
      });

      if (response && response.success) {
        console.log('토큰 저장 완료');
        return true;
      }

      console.warn('토큰 저장 실패:', response);
      return false;
    } catch (error) {
      console.error('토큰 저장 중 오류:', error);
      return false;
    }
  }

  // Background에게 "로그아웃해줘" 요청
  static async logout(): Promise<boolean> {
    try {
      console.log('로그아웃 요청 시작');

      const response = await this.sendMessageSafely<ChromeResponse>({
        type: 'LOGOUT',
      });

      if (response && response.success) {
        console.log('로그아웃 완료');
        return true;
      }

      console.warn('로그아웃 실패:', response);
      return false;
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      return false;
    }
  }

  // Background에게 "상태 알려줘" 요청
  static async getStatus(): Promise<TokenStatus> {
    try {
      console.log('상태 확인 요청 시작');

      const response = await this.sendMessageSafely<ChromeResponse>({
        type: 'CHECK_STATUS',
      });

      if (response && response.success && response.status) {
        console.log('상태 확인 완료:', response.status);
        return response.status;
      }

      console.warn('상태 확인 실패:', response);
      return { isLoggedIn: false };
    } catch (error) {
      console.error('상태 확인 중 오류:', error);
      return { isLoggedIn: false };
    }
  }

  // 연결 상태 확인 (디버깅용)
  static async checkConnection(): Promise<boolean> {
    try {
      const isInitialized = await this.initialize();
      if (!isInitialized) {
        return false;
      }

      const response = await this.sendMessageSafely<ChromeResponse>({
        type: 'PING',
      });

      return response?.success === true && response?.ready === true;
    } catch (error) {
      console.error('연결 확인 중 오류:', error);
      return false;
    }
  }

  // 초기화 상태를 강제로 리셋 (디버깅용)
  static resetInitialization(): void {
    this.isInitialized = false;
    this.initializationPromise = null;
    console.log('ChromeAuth 초기화 상태 리셋');
  }
}
