class TokenManager {
  constructor() {
    this.isReady = false;
    this.initializationInProgress = false;
    this.init();
  }

  async init() {
    if (this.initializationInProgress) {
      return;
    }

    this.initializationInProgress = true;

    try {
      // console.log('TokenManager 초기화 시작...');

      // Extension 시작시 한 번 체크
      await this.checkAndRefreshTokens();

      // 초기화 완료 표시
      this.isReady = true;
      // console.log('TokenManager 초기화 완료');

      // 메시지 리스너 등록 (한 번만)
      if (!chrome.runtime.onMessage.hasListeners()) {
        chrome.runtime.onMessage.addListener(
          (message, sender, sendResponse) => {
            this.handleMessage(message, sendResponse);
            return true; // 비동기 응답을 위해 필요
          }
        );
        // console.log('메시지 리스너 등록 완료');
      }

      // 24시간마다 체크하는 알람 설정
      if (chrome.alarms && chrome.alarms.create) {
        // 기존 알람 제거 후 새로 생성
        chrome.alarms.clear('dailyTokenCheck', () => {
          chrome.alarms.create('dailyTokenCheck', { periodInMinutes: 1440 });
          // console.log('토큰 체크 알람 설정 완료');
        });
      }

      // 알람 리스너 (한 번만 등록)
      if (!chrome.alarms.onAlarm.hasListeners()) {
        chrome.alarms.onAlarm.addListener((alarm) => {
          if (alarm.name === 'dailyTokenCheck') {
            // console.log('일일 토큰 체크 실행');
            this.checkAndRefreshTokens();
          }
        });
      }
    } catch (error) {
      console.error('TokenManager 초기화 중 오류:', error);
      this.isReady = true; // 오류가 있어도 메시지 처리는 가능하게 함
    } finally {
      this.initializationInProgress = false;
    }
  }

  async handleMessage(message, sendResponse) {
    try {
      // console.log('=== 메시지 수신 ===');
      // console.log('타입:', message.type);
      // console.log('데이터:', message);

      // 메시지 타입 검증
      if (!message || typeof message.type !== 'string') {
        console.error('잘못된 메시지 형식:', message);
        sendResponse({
          success: false,
          error: '잘못된 메시지 형식',
        });
        return;
      }

      // PING 메시지 처리 (연결 확인용) - 최우선 처리
      if (message.type === 'PING') {
        // console.log('PING 응답, isReady:', this.isReady);
        sendResponse({
          success: true,
          ready: this.isReady,
          timestamp: Date.now(),
        });
        return;
      }

      // 아직 초기화가 완료되지 않았다면 대기
      if (!this.isReady) {
        // console.log('초기화 대기 중...');

        // 최대 10초 대기
        const maxWaitTime = 10000;
        const startTime = Date.now();

        while (!this.isReady && Date.now() - startTime < maxWaitTime) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (!this.isReady) {
          console.error('초기화 타임아웃');
          sendResponse({
            success: false,
            error: '초기화 타임아웃',
          });
          return;
        }
      }

      // 메시지 타입별 처리
      switch (message.type) {
        case 'GET_TOKEN':
          // console.log('토큰 요청 처리 시작');
          try {
            const token = await this.getValidToken();
            // console.log('토큰 요청 완료:', token ? '토큰 있음' : '토큰 없음');
            sendResponse({
              success: true,
              token: token || null,
            });
          } catch (error) {
            console.error('토큰 요청 처리 중 오류:', error);
            sendResponse({
              success: false,
              error: error.message,
              token: null,
            });
          }
          break;

        case 'SAVE_TOKENS':
          // console.log('토큰 저장 요청 처리');
          try {
            if (
              !message.tokens ||
              !message.tokens.accessToken ||
              !message.tokens.refreshToken
            ) {
              throw new Error('잘못된 토큰 데이터');
            }
            await this.saveTokens(message.tokens);
            // console.log('토큰 저장 완료');
            sendResponse({ success: true });
          } catch (error) {
            console.error('토큰 저장 중 오류:', error);
            sendResponse({
              success: false,
              error: error.message,
            });
          }
          break;

        case 'LOGOUT':
          // console.log('로그아웃 요청 처리');
          try {
            await this.logout();
            // console.log('로그아웃 완료');
            sendResponse({ success: true });
          } catch (error) {
            console.error('로그아웃 중 오류:', error);
            sendResponse({
              success: false,
              error: error.message,
            });
          }
          break;

        case 'CHECK_STATUS':
          // console.log('상태 확인 요청 처리');
          try {
            const status = await this.getTokenStatus();
            // console.log('상태 확인 완료:', status);
            sendResponse({
              success: true,
              status: status,
            });
          } catch (error) {
            console.error('상태 확인 중 오류:', error);
            sendResponse({
              success: false,
              error: error.message,
              status: { isLoggedIn: false },
            });
          }
          break;

        default:
          console.warn('알 수 없는 메시지 타입:', message.type);
          sendResponse({
            success: false,
            error: `알 수 없는 메시지 타입: ${message.type}`,
          });
      }
    } catch (error) {
      console.error('메시지 처리 중 예외 발생:', error);
      sendResponse({
        success: false,
        error: error.message || '알 수 없는 오류',
      });
    }
  }

  // 핵심: 토큰 체크 및 갱신 로직
  async checkAndRefreshTokens() {
    try {
      // console.log('토큰 체크 시작...');

      const result = await chrome.storage.local.get([
        'accessToken',
        'refreshToken',
      ]);

      const { accessToken, refreshToken } = result;

      if (!accessToken || !refreshToken) {
        // console.log('저장된 토큰이 없습니다.');
        return;
      }

      const daysLeft = this.getDaysUntilExpiry(accessToken);
      // console.log(`토큰 만료까지 ${daysLeft}일 남음`);

      // 1일 이내 만료 예정이면 갱신
      if (daysLeft <= 1) {
        // console.log('토큰 갱신 필요 - 갱신 시작');
        await this.refreshTokens(refreshToken);
      } else {
        // console.log('토큰 갱신 불필요');
      }
    } catch (error) {
      console.error('토큰 체크 중 오류:', error);
    }
  }

  // JWT에서 만료일 계산
  getDaysUntilExpiry(token) {
    try {
      if (!token || typeof token !== 'string') {
        console.error('잘못된 토큰 형식');
        return 0;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('잘못된 JWT 형식');
        return 0;
      }

      const payload = JSON.parse(atob(parts[1]));

      if (!payload.exp) {
        console.error('토큰에 만료 시간이 없음');
        return 0;
      }

      const expiryTime = new Date(payload.exp * 1000);
      const now = new Date();
      const daysLeft = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

      return Math.max(0, daysLeft);
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
      return 0; // 파싱 오류시 만료된 것으로 간주
    }
  }

  // 토큰 갱신
  async refreshTokens(refreshToken) {
    try {
      // console.log('토큰 갱신 요청 중...');

      const response = await fetch('__API_URL__/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.accessToken && data.refreshToken) {
          await this.saveTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          // console.log('토큰 갱신 성공');

          // 프론트엔드에 갱신 알림
          this.notifyTokenRefresh();
        } else {
          throw new Error('갱신된 토큰 데이터가 없음');
        }
      } else {
        const errorText = await response.text();
        // console.log('토큰 갱신 실패:', response.status, errorText);
        await this.logout();
      }
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      await this.logout();
    }
  }

  // 유효한 토큰 반환 (필요시 즉시 갱신)
  async getValidToken() {
    try {
      const result = await chrome.storage.local.get([
        'accessToken',
        'refreshToken',
      ]);

      const { accessToken, refreshToken } = result;

      if (!accessToken) {
        // console.log('저장된 access token이 없음');
        return null;
      }

      const daysLeft = this.getDaysUntilExpiry(accessToken);
      // console.log('토큰 만료까지:', daysLeft, '일');

      // 만료되었으면 즉시 갱신 시도
      if (daysLeft <= 0) {
        // console.log('토큰 만료됨 - 갱신 시도');
        if (refreshToken) {
          await this.refreshTokens(refreshToken);

          // 갱신 후 새 토큰 가져오기
          const newResult = await chrome.storage.local.get(['accessToken']);
          return newResult.accessToken || null;
        }
        // console.log('refresh token도 없음');
        return null;
      }

      return accessToken;
    } catch (error) {
      console.error('유효한 토큰 가져오기 실패:', error);
      return null;
    }
  }

  async saveTokens({ accessToken, refreshToken }) {
    try {
      await chrome.storage.local.set({
        accessToken,
        refreshToken,
        savedAt: Date.now(),
      });
      // console.log('토큰 저장 완료');
    } catch (error) {
      console.error('토큰 저장 실패:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await chrome.storage.local.remove([
        'accessToken',
        'refreshToken',
        'savedAt',
      ]);
      // console.log('로그아웃 완료 - 토큰 삭제됨');

      await fetch('__API_URL__/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 프론트엔드에 로그아웃 알림
      this.notifyLogout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  }

  async getTokenStatus() {
    try {
      const result = await chrome.storage.local.get(['accessToken']);
      const { accessToken } = result;

      if (!accessToken) {
        return { isLoggedIn: false };
      }

      const daysLeft = this.getDaysUntilExpiry(accessToken);

      if (daysLeft <= 0) {
        return { isLoggedIn: false };
      }

      return {
        isLoggedIn: true,
        daysLeft,
        willExpireSoon: daysLeft <= 1,
      };
    } catch (error) {
      console.error('토큰 상태 확인 실패:', error);
      return { isLoggedIn: false };
    }
  }

  // 프론트엔드에 알림 전송
  notifyTokenRefresh() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.includes('chrome-extension://')) {
          chrome.tabs
            .sendMessage(tab.id, {
              type: 'TOKEN_REFRESHED',
              timestamp: Date.now(),
            })
            .catch((error) => {
              // 탭이 없거나 메시지 수신 불가시 무시
              // console.log('토큰 갱신 알림 전송 실패:', tab.id, error.message);
            });
        }
      });
    });
  }

  notifyLogout() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.includes('chrome-extension://')) {
          chrome.tabs
            .sendMessage(tab.id, {
              type: 'AUTO_LOGOUT',
              timestamp: Date.now(),
            })
            .catch((error) => {
              // 탭이 없거나 메시지 수신 불가시 무시
              // console.log(
              //   '자동 로그아웃 알림 전송 실패:',
              //   tab.id,
              //   error.message
              // );
            });
        }
      });
    });
  }
}

// TokenManager 인스턴스 생성
// console.log('Background script 시작...');
const tokenManager = new TokenManager();

// 전역 오류 처리
self.addEventListener('error', (event) => {
  console.error('Background script 전역 오류:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Background script 처리되지 않은 Promise 거부:', event.reason);
});

// console.log('Background script 로드 완료');
