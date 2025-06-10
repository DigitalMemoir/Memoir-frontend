import { type DayCellContentArg } from '@fullcalendar/core';
import textStyles from '../../../styles/textStyles';

const Day = (arg: DayCellContentArg) => {
  return (
    <div className={`${textStyles.text2} text-text-subtle`}>
      {arg.dayNumberText}
    </div>
  );
};

export default Day;
