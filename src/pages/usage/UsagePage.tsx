import dayjs from 'dayjs';
import axiosInstance from '../../lib/axiosInstance';
import type { IActivityStatsResponse } from '../../types/IUsage';
import { getBrowsingHistory } from '../../utils/getBrowsingHistory';
import Statistics from './Statistics';
import TotalTimes from './TotalTimes';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const data: IActivityStatsResponse = {
  activityStats: {
    totalUsageTimeMinutes: 185,
    categorySummaries: [
      {
        category: '업무, 프로젝트',
        totalTimeMinutes: 50,
      },
      {
        category: '뉴스, 정보 탐색',
        totalTimeMinutes: 30,
      },
      {
        category: '공부, 학습',
        totalTimeMinutes: 90,
      },
      {
        category: '쇼핑',
        totalTimeMinutes: 15,
      },
    ],
    hourlyActivityBreakdown: [
      {
        hour: 8,
        totalUsageMinutes: 30,
        categoryMinutes: {
          '공부, 학습': 30,
        },
      },
      {
        hour: 9,
        totalUsageMinutes: 20,
        categoryMinutes: {
          '업무, 프로젝트': 20,
        },
      },
      {
        hour: 10,
        totalUsageMinutes: 60,
        categoryMinutes: {
          '공부, 학습': 60,
        },
      },
      {
        hour: 12,
        totalUsageMinutes: 30,
        categoryMinutes: {
          '뉴스, 정보 탐색': 30,
        },
      },
      {
        hour: 15,
        totalUsageMinutes: 15,
        categoryMinutes: {
          쇼핑: 15,
        },
      },
      {
        hour: 0,
        totalUsageMinutes: 30,
        categoryMinutes: {
          '업무, 프로젝트': 12,
          쇼핑: 12,
          '뉴스, 정보 탐색': 12,
          '공부, 학습': 12,
          '콘텐츠 소비': 12,
        },
      },
      {
        hour: 1,
        totalUsageMinutes: 30,
        categoryMinutes: {
          '업무, 프로젝트': 12,
          쇼핑: 12,
          '뉴스, 정보 탐색': 12,
          '콘텐츠 소비': 12,
          '공부, 학습': 12,
        },
      },
    ],
  },
};

const UsagePage = () => {
  const [data, setData] = useState<IActivityStatsResponse | undefined>(
    undefined
  );

  const getUsageData = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const browsingHistory = await getBrowsingHistory(today);
    const response = await axiosInstance.post('/api/time', browsingHistory);

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
      console.error('오늘의 분석 기록을 가져오지 못했어요.');
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
