import dayjs from 'dayjs';
import type { IVisitedPage } from '../types/IVisitedPages';
import { exampleHistoryData } from './exampleHIstoryData';
import { showErrorToast } from '../components/Toast/showToast';

interface IHistoryItemWithVisits {
  title: string;
  url: string;
  visitTime: number;
}

const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const isSimilarPage = (
  item1: IHistoryItemWithVisits,
  item2: IHistoryItemWithVisits
): boolean => {
  // 도메인이 같고 제목이 같으면 같은 페이지로 간주
  return (
    extractDomain(item1.url) === extractDomain(item2.url) &&
    item1.title === item2.title
  );
};

const isOAuthUrl = (url: string): boolean => {
  return url.toLowerCase().includes('oauth');
};

// 활성 세션인지 판단 (5분 이내에 2개 이상 방문이 있으면 활성)
const isActiveSession = (
  allItems: IHistoryItemWithVisits[],
  currentIndex: number,
  lookAheadCount: number = 3
): boolean => {
  const currentItem = allItems[currentIndex];
  let recentVisits = 0;

  // 앞으로 3개 항목을 확인하여 5분 이내에 방문이 있는지 확인
  for (
    let i = currentIndex + 1;
    i < Math.min(allItems.length, currentIndex + 1 + lookAheadCount);
    i++
  ) {
    const item = allItems[i];
    const timeDiff = (currentItem.visitTime - item.visitTime) / 1000;

    // 5분 이내의 방문이 있으면 활성 세션으로 판단
    if (timeDiff <= 5 * 60) {
      recentVisits++;
    } else {
      break; // 5분을 넘어가면 확인 중단
    }
  }

  // 5분 이내에 2개 이상의 방문이 있으면 활성 세션
  return recentVisits >= 2;
};

// 활성 세션에서의 사용 시간 계산
const calculateActiveSessionDuration = (
  allItems: IHistoryItemWithVisits[],
  currentIndex: number
): number => {
  const currentItem = allItems[currentIndex];
  const nextItem = allItems[currentIndex + 1];

  if (!nextItem) return 0;

  const timeDiff = (currentItem.visitTime - nextItem.visitTime) / 1000;

  // 활성 세션에서는 실제 시간 차이를 사용하되, 최대 10분으로 제한
  return Math.min(timeDiff, 10 * 60);
};

const calculateDuration = (
  allItems: IHistoryItemWithVisits[],
  currentIndex: number
): number => {
  const currentItem = allItems[currentIndex];
  const nextItem = allItems[currentIndex + 1];

  if (!nextItem) {
    // 마지막 항목인 경우 기본값 사용
    return 60;
  }

  // 다음 항목이 같은 페이지면 연속 방문으로 처리
  if (isSimilarPage(currentItem, nextItem)) {
    return 0;
  }

  // 시간 차이 계산 (초 단위)
  const timeDiffSeconds = Math.floor(
    (currentItem.visitTime - nextItem.visitTime) / 1000
  );

  // 활성 세션 확인
  if (isActiveSession(allItems, currentIndex)) {
    const activeDuration = calculateActiveSessionDuration(
      allItems,
      currentIndex
    );
    if (activeDuration > 0) {
      return activeDuration;
    }

    // 활성 세션이지만 계산된 duration이 없으면 더 관대한 기본값 사용
    if (timeDiffSeconds <= 10 * 60) {
      // 10분 이내
      return Math.min(timeDiffSeconds, 5 * 60); // 최대 5분
    }
  }

  // 비활성 세션의 경우 기존 로직 사용
  const MAX_DURATION = 30 * 60; // 30분

  if (timeDiffSeconds > MAX_DURATION) {
    // 시간 차이에 따른 적응적 기본값
    if (timeDiffSeconds > 4 * 60 * 60) {
      // 4시간 이상 차이
      return 60; // 1분
    } else if (timeDiffSeconds > 2 * 60 * 60) {
      // 2시간 이상 차이
      return 120; // 2분
    } else if (timeDiffSeconds > 60 * 60) {
      // 1시간 이상 차이
      return 300; // 5분
    } else {
      return 600; // 10분
    }
  }

  return Math.max(timeDiffSeconds, 0);
};

const aggregateVisitedPages = (
  items: IHistoryItemWithVisits[]
): IVisitedPage[] => {
  const result: IVisitedPage[] = [];
  const processedIndices = new Set<number>();

  for (let i = 0; i < items.length && result.length < 30; i++) {
    if (processedIndices.has(i)) continue;

    const currentItem = items[i];
    let totalDuration = calculateDuration(items, i);
    let visitCount = 1;

    // 같은 페이지의 연속 방문들을 찾아서 합치기
    for (let j = i + 1; j < items.length; j++) {
      if (processedIndices.has(j)) continue;

      const nextItem = items[j];
      if (isSimilarPage(currentItem, nextItem)) {
        totalDuration += calculateDuration(items, j);
        visitCount++;
        processedIndices.add(j);
      } else {
        // 연속되지 않은 같은 페이지는 별도로 처리하지 않음 (최근 순 우선)
        break;
      }
    }

    result.push({
      title: currentItem.title,
      url: currentItem.url,
      visitCount,
      startTimestamp: currentItem.visitTime,
      durationSeconds: Math.max(totalDuration, 0),
    });

    processedIndices.add(i);
  }

  return result;
};

export const getBrowsingHistory = async (
  date: string
): Promise<IVisitedPage[]> => {
  const start = dayjs(date).startOf('day').valueOf();
  const end = dayjs(date).endOf('day').valueOf();

  if (dayjs().isBefore(dayjs(date))) {
    showErrorToast('미래의 날짜에 대한 기록은 조회할 수 없습니다.');
    return [];
  }

  // 확장 프로그램 여부 판단
  const isChrome = typeof chrome !== 'undefined' && !!chrome.history;

  if (isChrome) {
    return new Promise((resolve) => {
      chrome.history.search(
        { text: '', startTime: start, endTime: end, maxResults: 500 }, // 더 많은 데이터를 가져와서 필터링
        async (items) => {
          // 모든 방문 기록을 평탄화하여 시간순으로 정렬
          const allVisits: IHistoryItemWithVisits[] = [];

          await Promise.all(
            items.map(async (item) => {
              if (!item.url || isOAuthUrl(item.url)) return; // OAuth URL 필터링

              const visits = await new Promise<any[]>((res) =>
                chrome.history.getVisits({ url: item.url! }, res)
              );

              visits
                .filter(
                  (visit) => visit.visitTime >= start && visit.visitTime <= end
                )
                .forEach((visit) => {
                  allVisits.push({
                    title: item.title ?? '(no title)',
                    url: item.url!,
                    visitTime: visit.visitTime,
                  });
                });
            })
          );

          // 최근 순으로 정렬 (visitTime 내림차순)
          allVisits.sort((a, b) => b.visitTime - a.visitTime);

          // 페이지별로 집계하여 최대 30개 반환
          const result = aggregateVisitedPages(allVisits);
          resolve(result);
        }
      );
    });
  }

  // 예제 데이터에서도 OAuth URL 필터링
  const filteredExampleData = exampleHistoryData.visitedPages
    .filter((page) => !isOAuthUrl(page.url))
    .slice(0, 30);

  return filteredExampleData;
};
