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
    const res = await axiosInstance.post('/api/daily', {
      date: formatted,
      visitedPages: visitedPages,
    });
    return res.data as ISummaryResponse;
  };

  const { mutateAsync } = useMutation<ISummaryResponse, Error, string>({
    mutationFn: generateDateSummary,
    onError: (error) => {
      console.error('일일 요약 생성에 실패하였습니다.', error);
    },
    retry: false,
  });

  return mutateAsync;
};
