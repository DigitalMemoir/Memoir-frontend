import dayjs from 'dayjs';
import type { IVisitedPage } from '../types/IVisitedPages';
import { exampleHistoryData } from './exampleHIstoryData';
import { showErrorToast } from '../components/Toast/showToast';

interface HistoryItemWithVisits {
  title: string;
  url: string;
  visitTime: number;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function isSimilarPage(
  item1: HistoryItemWithVisits,
  item2: HistoryItemWithVisits
): boolean {
  // 도메인이 같고 제목이 같으면 같은 페이지로 간주
  return (
    extractDomain(item1.url) === extractDomain(item2.url) &&
    item1.title === item2.title
  );
}

function isOAuthUrl(url: string): boolean {
  return url.toLowerCase().includes('oauth');
}

function calculateDuration(
  allItems: HistoryItemWithVisits[],
  currentIndex: number
): number {
  const currentItem = allItems[currentIndex];
  const nextItem = allItems[currentIndex + 1];

  if (!nextItem) {
    // 마지막 항목인 경우, 이전 항목들과의 평균 간격을 사용하거나 기본값 사용
    return 60; // 기본 1분
  }

  // 다음 항목이 다른 페이지면 그 차이를 duration으로 사용
  if (!isSimilarPage(currentItem, nextItem)) {
    return Math.floor((currentItem.visitTime - nextItem.visitTime) / 1000);
  }

  // 같은 페이지면 0 (연속 방문으로 처리)
  return 0;
}

function aggregateVisitedPages(items: HistoryItemWithVisits[]): IVisitedPage[] {
  const result: IVisitedPage[] = [];
  const processedIndices = new Set<number>();

  for (let i = 0; i < items.length && result.length < 10; i++) {
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
}

export async function getBrowsingHistory(
  date: string
): Promise<IVisitedPage[]> {
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
          const allVisits: HistoryItemWithVisits[] = [];

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
}
