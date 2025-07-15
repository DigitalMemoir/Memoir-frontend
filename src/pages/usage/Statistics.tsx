import { useMemo, useState } from 'react';
import type { IHourlyBreakdown } from '../../types/IUsage';
import { getChartDataFromActivityStats } from './getChartDataFromActivityStats';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

const Statistics = ({ hourlyData }: { hourlyData: IHourlyBreakdown[] }) => {
  const nowHour = dayjs().hour();
  const [rangeStart, setRangeStart] = useState(
    nowHour < 6 ? 0 : nowHour < 12 ? 6 : nowHour < 18 ? 12 : 18
  );
  const chartData = useMemo(() => {
    return getChartDataFromActivityStats(hourlyData, rangeStart);
  }, [hourlyData, rangeStart]);
  return (
    <div className={'p-10 flex flex-row gap-20 items-center'}>
      <ChevronLeftIcon className={'text-gray-2 h-6'} />
      <div className={'w-full max-w-[696px] stroke-3'}>
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
                  color: '#b3b3b3',
                  font: {
                    size: 16,
                    family: 'Pretendard Variable',
                    weight: 'normal',
                  },
                },
              },
              y: {
                position: 'right',
                beginAtZero: true,
                min: 0,
                max: 60,
                ticks: {
                  color: '#b3b3b3',
                  stepSize: 12,
                  callback: function (value, index, ticks) {
                    if (index === 0 || index === ticks.length - 1) {
                      return `${value}분`;
                    }
                    return '';
                  },
                  font: {
                    size: 16,
                    family: 'Pretendard Variable',
                    weight: 'normal',
                  },
                },
                grid: {
                  color: '#e3e3e3',
                },
              },
            },
          }}
        />
      </div>

      <ChevronRightIcon className={'text-gray-2 h-6 stroke-3'} />
    </div>
  );
};

export default Statistics;
