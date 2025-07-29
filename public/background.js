class TokenManager {
  constructor() {
    this.init();
  }

  async init() {
    // Extension 시작시 한 번 체크
    await this.checkAndRefreshTokens();

    // 24시간마다 체크하는 알람 설정
    if (chrome.alarms && chrome.alarms.create) {
      chrome.alarms.create('dailyTokenCheck', { periodInMinutes: 1440 });
    }

    // 알람 리스너
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'dailyTokenCheck') {
        this.checkAndRefreshTokens();
      }
    });

    // 메시지 리스너
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sendResponse);
      return true; // 비동기 응답을 위해 필요
    });
  }

  async handleMessage(message, sendResponse) {
    try {
      switch (message.type) {
        case 'GET_TOKEN':
          const token = await this.getValidToken();
          sendResponse({ success: true, token });
          break;

        case 'SAVE_TOKENS':
          await this.saveTokens(message.tokens);
          sendResponse({ success: true });
          break;

        case 'LOGOUT':
          await this.logout();
          sendResponse({ success: true });
          break;

        case 'CHECK_STATUS':
          const status = await this.getTokenStatus();
          sendResponse({ success: true, status });
          break;

        default:
          sendResponse({ success: false, error: '알 수 없는 메시지 타입' });
      }
    } catch (error) {
      console.error('메시지 처리 중 오류:', error);
      sendResponse({
        success: false,
        error: error.message || '알 수 없는 오류',
      });
    }
  }

  // 핵심: 토큰 체크 및 갱신 로직
  async checkAndRefreshTokens() {
    try {
      const { accessToken, refreshToken } = await chrome.storage.local.get([
        'accessToken',
        'refreshToken',
      ]);

      if (!accessToken || !refreshToken) {
        console.log('토큰이 없습니다.');
        return;
      }

      const daysLeft = this.getDaysUntilExpiry(accessToken);
      console.log(`토큰 만료까지 ${daysLeft}일 남음`);

      // 1일 이내 만료 예정이면 갱신
      if (daysLeft <= 1) {
        console.log('토큰 갱신 시작');
        await this.refreshTokens(refreshToken);
      }
    } catch (error) {
      console.error('토큰 체크 중 오류:', error);
    }
  }

  // JWT에서 만료일 계산
  getDaysUntilExpiry(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = new Date(payload.exp * 1000);
      const now = new Date();
      return Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
      return 0; // 파싱 오류시 만료된 것으로 간주
    }
  }

  // 토큰 갱신
  async refreshTokens(refreshToken) {
    try {
      console.log('토큰 갱신 요청 중...');
      const response = await fetch('__API_URL__/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await this.saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        console.log('토큰 갱신 성공');

        // 프론트엔드에 갱신 알림
        this.notifyTokenRefresh();
      } else {
        console.log('토큰 갱신 실패, 로그아웃 처리');
        await this.logout();
      }
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      await this.logout();
    }
  }

  // 유효한 토큰 반환 (필요시 즉시 갱신)
  async getValidToken() {
    const { accessToken, refreshToken } = await chrome.storage.local.get([
      'accessToken',
      'refreshToken',
    ]);

    if (!accessToken) return null;

    const daysLeft = this.getDaysUntilExpiry(accessToken);

    // 만료되었으면 즉시 갱신 시도
    if (daysLeft <= 0) {
      if (refreshToken) {
        await this.refreshTokens(refreshToken);
        const { accessToken: newToken } = await chrome.storage.local.get([
          'accessToken',
        ]);
        return newToken;
      }
      return null;
    }

    return accessToken;
  }

  async saveTokens({ accessToken, refreshToken }) {
    await chrome.storage.local.set({
      accessToken,
      refreshToken,
      savedAt: Date.now(),
    });
    console.log('토큰 저장 완료');
  }

  async logout() {
    await chrome.storage.local.remove([
      'accessToken',
      'refreshToken',
      'savedAt',
    ]);
    console.log('로그아웃 완료');
    // 프론트엔드에 로그아웃 알림
    this.notifyLogout();
  }

  async getTokenStatus() {
    const { accessToken } = await chrome.storage.local.get(['accessToken']);

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
  }

  // 프론트엔드에 알림 전송
  notifyTokenRefresh() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.includes('chrome-extension://')) {
          chrome.tabs
            .sendMessage(tab.id, { type: 'TOKEN_REFRESHED' })
            .catch(() => {
              // 탭이 없거나 메시지 수신 불가시 무시
            });
        }
      });
    });
  }

  notifyLogout() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.url.includes('chrome-extension://')) {
          chrome.tabs.sendMessage(tab.id, { type: 'AUTO_LOGOUT' }).catch(() => {
            // 탭이 없거나 메시지 수신 불가시 무시
          });
        }
      });
    });
  }
}

// TokenManager 인스턴스 생성
new TokenManager();
