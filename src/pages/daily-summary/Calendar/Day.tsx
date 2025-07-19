import { type DayCellContentArg } from '@fullcalendar/core';
import textStyles from '../../../styles/textStyles';
import clsx from 'clsx';

const Day = (arg: DayCellContentArg) => {
  return (
    <div className={clsx(textStyles.text2, 'text-text-subtle')}>
      {arg.dayNumberText}
    </div>
  );
};

export default Day;
