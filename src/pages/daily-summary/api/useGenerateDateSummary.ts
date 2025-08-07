import dayjs from 'dayjs';
import { getBrowsingHistory } from '../../../utils/getBrowsingHistory';
import axiosInstance from '../../../lib/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import type { ISummaryResponse } from '../../../types/ICalendar';

export const useGenerateDateSummary = () => {
  const generateDateSummary = async (date: string) => {
    const day = dayjs(date);
    const formatted = day.format('YYYY-MM-DD');
    const visitedPages = await getBrowsingHistory(formatted);
    if (visitedPages.length === 0) {
      throw new Error('방문 기록이 없습니다. 요약을 생성할 수 없습니다.');
    }
    const res = await axiosInstance.post('/api/daily', {
      date: formatted,
      visitedPages: visitedPages,
    });
    return res.data as ISummaryResponse;
  };

  const { mutateAsync } = useMutation<ISummaryResponse, Error, string>({
    mutationFn: generateDateSummary,
    retry: false,
  });

  return mutateAsync;
};
