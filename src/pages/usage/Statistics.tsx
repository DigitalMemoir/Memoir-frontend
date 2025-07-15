import { useMemo, useState } from 'react';
import type { IHourlyBreakdown } from '../../types/IUsage';
import { getChartDataFromActivityStats } from './getChartDataFromActivityStats';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

const Statistics = ({ hourlyData }: { hourlyData: IHourlyBreakdown[] }) => {
  const nowHour = dayjs().hour();
  const [rangeStart, setRangeStart] = useState(
    nowHour < 6 ? 0 : nowHour < 12 ? 6 : nowHour < 18 ? 12 : 18
  );

  const handlePrevRange = () => {
    setRangeStart((prev) => (prev === 0 ? 0 : prev - 6));
  };

  const handleNextRange = () => {
    setRangeStart((prev) => (prev === 18 ? 18 : prev + 6));
  };

  const chartData = useMemo(() => {
    return getChartDataFromActivityStats(hourlyData, rangeStart);
  }, [hourlyData, rangeStart]);
  return (
    <div
      className={
        'py-10 px-7 flex flex-row gap-20 items-center shadow-button-1 rounded-[20px]'
      }
    >
      <button
        disabled={rangeStart === 0}
        className={clsx(
          'flex items-center justify-center p-3 rounded-full',
          rangeStart !== 0 && 'hover:cursor-pointer hover:bg-[#efefef]'
        )}
        onClick={handlePrevRange}
      >
        <ChevronLeftIcon className={'text-gray-2 h-6 stroke-3'} />
      </button>
      <div className={'w-full h-auto aspect-[2/1]'}>
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
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
      <button
        disabled={rangeStart === 18}
        className={clsx(
          'flex items-center justify-center p-3 rounded-full',
          rangeStart !== 18 && 'hover:cursor-pointer hover:bg-[#efefef]'
        )}
        onClick={handleNextRange}
      >
        <ChevronRightIcon className={'text-gray-2 h-6 stroke-3'} />
      </button>
    </div>
  );
};

export default Statistics;
