import type { ChartData } from 'chart.js';
import type { IHourlyBreakdown } from '../../types/IUsage';
import dayjs from 'dayjs';

const CATEGORY_LABELS = [
  '공부, 학습',
  '업무, 프로젝트',
  '뉴스, 정보 탐색',
  '쇼핑',
  '콘텐츠 소비',
] as const;

type CategoryType = (typeof CATEGORY_LABELS)[number];

const CATEGORY_COLORS: Record<CategoryType, string> = {
  '공부, 학습': '#4F46E5',
  '업무, 프로젝트': '#22C55E',
  '뉴스, 정보 탐색': '#F59E0B',
  쇼핑: '#EC4899',
  '콘텐츠 소비': '#3B82F6',
};

export const getChartDataFromActivityStats = (
  hourlyData: IHourlyBreakdown[]
): ChartData<'bar'> => {
  const nowHour = dayjs().hour();
  const rangeStart =
    nowHour < 6 ? 0 : nowHour < 12 ? 6 : nowHour < 18 ? 12 : 18;
  const hourRange = Array.from({ length: 6 }, (_, i) => rangeStart + i);

  const filteredData = hourlyData.filter((d) => hourRange.includes(d.hour));

  const datasets = CATEGORY_LABELS.map((category) => ({
    label: category,
    data: hourRange.map((hour) => {
      const matched = filteredData.find((d) => d.hour === hour);
      return matched?.categoryMinutes?.[category] ?? 0;
    }),
    backgroundColor: CATEGORY_COLORS[category],
    stack: 'activity',
    borderRadius: {
      topLeft: 10,
      topRight: 10,
      bottomLeft: 0,
      bottomRight: 0,
    },
  }));

  return {
    labels: hourRange.map((h) => `${h}시`),
    datasets,
  };
};
