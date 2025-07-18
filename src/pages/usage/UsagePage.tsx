import dayjs from 'dayjs';
import axiosInstance from '../../lib/axiosInstance';
import type { IActivityStatsResponse } from '../../types/IUsage';
import { getBrowsingHistory } from '../../utils/getBrowsingHistory';
import Statistics from './Statistics';
import TotalTimes from './TotalTimes';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { showErrorToast } from '../../components/Toast/showToast';

const UsagePage = () => {
  const [data, setData] = useState<IActivityStatsResponse | null>(null);

  const getUsageData = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const browsingHistory = await getBrowsingHistory(today);
    const response = await axiosInstance.post('/api/time', {
      date: today,
      visitedPages: browsingHistory,
    });
    console.log('Usage data fetched:', response);
    return response.data;
  };

  useEffect(() => {
    mutate();
  }, []);

  const { mutate } = useMutation({
    mutationFn: getUsageData,
    onSuccess: (data) => {
      setData(data.data);
    },
    onError: (error) => {
      showErrorToast(
        '오늘의 분석 기록을 가져오지 못했어요.\n다시 시도해주세요.'
      );
      console.error(error);
    },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={
        'flex flex-col items-center mt-[7.41vh] w-[51vw] max-w-[978px] min-w-[600px]'
      }
    >
      <Statistics hourlyData={data.activityStats.hourlyActivityBreakdown} />
      <div className={'flex flex-row items-center gap-6 mt-10'}>
        {data?.activityStats.categorySummaries
          .sort((a, b) => (a.totalTimeMinutes > b.totalTimeMinutes ? -1 : 1))
          .slice(0, 3)
          .map((summary) => (
            <TotalTimes
              key={summary.category}
              category={summary.category}
              minutes={summary.totalTimeMinutes}
            />
          ))}
      </div>
    </div>
  );
};

export default UsagePage;
