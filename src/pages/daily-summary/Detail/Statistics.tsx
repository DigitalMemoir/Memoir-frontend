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
      <div className={'grid grid-cols-4 gap-2 w-full items-center'}>
        <span className={clsx(textStyles.text2, 'text-text-body')}>
          총 탐색 시간:
        </span>
        <span className={clsx(textStyles.text2_1, 'text-text-body col-span-3')}>
          {formatMinutesToTime(totalUsageTimeMinutes)}
        </span>
        <span className={clsx(textStyles.text2, 'text-text-body')}>
          정보 탐색 성향:
        </span>
        <span className={clsx(textStyles.text2_1, 'text-text-body col-span-3')}>
          {activityProportionElements.join(', ')}
        </span>
      </div>
    </Contents>
  );
};

export default Statistics;
