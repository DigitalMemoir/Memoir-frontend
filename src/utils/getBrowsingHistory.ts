import dayjs from 'dayjs';
import type { IVisitedPage } from '../types/IVisitedPages';
import { exampleHistoryData } from './exampleHIstoryData';

export async function getBrowsingHistory(
  date: string
): Promise<IVisitedPage[]> {
  const start = dayjs(date).startOf('day').valueOf();
  const end = dayjs(date).endOf('day').valueOf();

  // 확장 프로그램 여부 판단
  const isChrome = typeof chrome !== 'undefined' && !!chrome.history;

  if (isChrome) {
    return new Promise((resolve) => {
      chrome.history.search(
        { text: '', startTime: start, endTime: end, maxResults: 1000 },
        async (items) => {
          const results = await Promise.all(
            items.map(async (item) => {
              if (!item.url) return null;
              const visits = await new Promise<any[]>((res) =>
                chrome.history.getVisits({ url: item.url! }, res)
              );
              const timestamps = visits
                .map((v) => v.visitTime)
                .filter((t) => t >= start && t <= end)
                .sort();
              if (timestamps.length === 0) return null;

              const startTimestamp = timestamps[0];
              const duration = Math.max(
                0,
                (timestamps.at(-1) ?? startTimestamp) - startTimestamp
              );
              return {
                title: item.title ?? '(no title)',
                url: item.url,
                visitCount: timestamps.length,
                startTimestamp,
                durationSeconds: Math.floor(duration / 1000),
              };
            })
          );
          resolve(results.filter(Boolean) as IVisitedPage[]);
        }
      );
    });
  }

  return exampleHistoryData.visitedPages;
}
