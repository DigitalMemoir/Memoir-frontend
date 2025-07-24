import Contents from './Contents';
import ClockImage from '../../../assets/icons/clock.png';
import type { ITimeLine } from '../../../types/ICalendar';
import clsx from 'clsx';
import textStyles from '../../../styles/textStyles';

const Timeline = ({ timelines }: { timelines: Array<ITimeLine> }) => {
  return (
    <Contents icon={ClockImage} title={'타임라인 요약'}>
      <div className={'grid grid-cols-4 gap-2 w-full items-center'}>
        {timelines.map((item) => (
          <>
            <span
              key={item.time}
              className={clsx(
                textStyles.text2_1,
                'text-text-body',
                'cursor-default'
              )}
            >
              {item.time}
            </span>
            <span
              key={item.description}
              className={clsx(
                textStyles.text2,
                'cursor-default',
                'text-text-body col-span-3 truncate'
              )}
            >
              {item.description}
            </span>
          </>
        ))}
      </div>
    </Contents>
  );
};

export default Timeline;
