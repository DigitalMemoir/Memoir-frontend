import { useMemo } from 'react';
import type { IHourlyBreakdown } from '../../types/IUsage';
import { getChartDataFromActivityStats } from './getChartDataFromActivityStats';
import { Bar } from 'react-chartjs-2';

const Statistics = ({ hourlyData }: { hourlyData: IHourlyBreakdown[] }) => {
  const chartData = useMemo(() => {
    return getChartDataFromActivityStats(hourlyData);
  }, [hourlyData]);
  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        datasets: {
          bar: {
            categoryPercentage: 1.0,
            barPercentage: 0.66,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              color: '#e3e3e3',
            },

            ticks: {
              font: {
                size: 16,
                family: 'Pretendard Variable',
                weight: 'normal',
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 12,
              display: false,
            },
            grid: {
              color: '#e3e3e3',
            },
          },
        },
      }}
    />
  );
};

export default Statistics;
