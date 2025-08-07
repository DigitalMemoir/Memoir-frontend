import type { ChartData } from 'chart.js';
import type { IHourlyBreakdown } from '../../types/IUsage';
import { categoryColors } from '../../styles/categoryColors';

export const getChartDataFromActivityStats = (
  hourlyData: IHourlyBreakdown[],
  rangeStart: number = 0
): ChartData<'bar'> => {
  const hourRange = Array.from({ length: 6 }, (_, i) => rangeStart + i);

  const categoryList = [
    '공부, 학습',
    '업무, 프로젝트',
    '뉴스, 정보 탐색',
    '쇼핑',
    '콘텐츠 소비',
  ] as const;

  // 해당 시간대의 데이터를 모두 0으로 초기화된 형태로 생성
  const hourDataMap: Record<number, IHourlyBreakdown> = {};
  for (const hour of hourRange) {
    hourDataMap[hour] = {
      hour,
      totalUsageMinutes: 0,
      categoryMinutes: {},
    };
  }

  // 실제 데이터를 덮어씌움
  for (const item of hourlyData) {
    if (hourRange.includes(item.hour)) {
      hourDataMap[item.hour] = item;
    }
  }

  const sortedHourlyData = hourRange.map((hour) => hourDataMap[hour]);

  const topCategoryPerHour = sortedHourlyData.map((d) => {
    const categories = categoryList.filter(
      (category) => d.categoryMinutes?.[category] ?? 0 > 0
    );

    return categories[categories.length - 1] ?? null;
  });

  const datasets = categoryList.map((category) => ({
    label: category,
    data: sortedHourlyData.map((d) => d.categoryMinutes?.[category] ?? 0),
    backgroundColor: categoryColors[category],
    stack: 'activity',
    borderRadius: sortedHourlyData.map((_, i) =>
      topCategoryPerHour[i] === category
        ? { topLeft: 50, topRight: 50, bottomLeft: 0, bottomRight: 0 }
        : 0
    ),
  }));

  return {
    labels: hourRange.map((h) => `${h}시`),
    datasets,
  };
};
