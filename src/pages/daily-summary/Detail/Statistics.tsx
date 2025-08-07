import Contents from './Contents';
import StatisticsImage from '../../../assets/icons/statistics.png';
import type { IStatistics } from '../../../types/ICalendar';
import { formatMinutesToTime } from '../../../lib/formatMinutesToTime';
import clsx from 'clsx';
import textStyles from '../../../styles/textStyles';

const Statistics = ({
  totalUsageTimeMinutes,
  activityProportions,
}: IStatistics) => {
  const activityProportionElements = activityProportions.map(
    (item) => `${item.category} ${item.percentage}%`
  );
  return (
    <Contents icon={StatisticsImage} title="활동 통계 요약">
      <div className={'grid grid-cols-4 gap-2 w-full items-start'}>
        <span className={clsx(textStyles.text2, 'text-text-body')}>
          총 탐색 시간:
        </span>
        <span className={clsx(textStyles.text2_1, 'text-text-body col-span-3')}>
          {formatMinutesToTime(totalUsageTimeMinutes)}
        </span>
        <span
          className={clsx(textStyles.text2, 'text-text-body whitespace-nowrap')}
        >
          정보 탐색 성향:
        </span>
        <span
          className={clsx(
            textStyles.text2_1,
            'text-text-body col-span-3',
            'flex flex-col gap-1'
          )}
        >
          {activityProportionElements.map((item, index) => (
            <span key={item}>
              {item}
              {index < activityProportionElements.length - 1 ? <br /> : ''}
            </span>
          ))}
        </span>
      </div>
    </Contents>
  );
};

export default Statistics;
