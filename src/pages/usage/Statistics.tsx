import type { IActivityStatsResponse } from '../../types/IUsage';
import { getChartDataFromActivityStats } from './getChartDataFromActivityStats';
import { Bar } from 'react-chartjs-2';
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
        hour: 20,
        totalUsageMinutes: 30,
        categoryMinutes: {
          '업무, 프로젝트': 12,
          쇼핑: 12,
          '뉴스, 정보 탐색': 12,
          '공부, 학습': 12,
          '콘텐츠 소비': 12,
        },
      },
    ],
  },
};

const Statistics = () => {
  const chartData = getChartDataFromActivityStats(
    data.activityStats.hourlyActivityBreakdown
  );
  return <Bar data={chartData} />;
};

export default Statistics;
