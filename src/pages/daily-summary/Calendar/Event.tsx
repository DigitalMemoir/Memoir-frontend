import type { EventContentArg } from '@fullcalendar/core/index.js';
import clsx from 'clsx';
import textStyles from '../../../styles/textStyles';
import React from 'react';
const colorPalette = [
  'bg-[#FFF3BD]',
  'bg-[#CFFFCF]',
  'bg-[#FFD6D6]',
  'bg-[#B9F6FF]',
  'bg-[#DEC1FF]',
];

interface IEventProps extends EventContentArg {
  isPopupOpen?: boolean;
}

const getColorClass = (key: string): string => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

const Event = React.forwardRef<HTMLDivElement, IEventProps>(
  ({ event: { title }, isPopupOpen }, _forwardedRef) => {
    const colorClass = getColorClass(title);

    return (
      <div
        ref={_forwardedRef}
        className={clsx(
          colorClass,
          'w-full h-5 pl-3',
          'flex flex-row items-center justify-start',
          textStyles.sub2,
          'text-text-body',
          'cursor-default',
          'absolute',
          isPopupOpen ? 'z-[10]' : 'z-[1]',
          'truncate'
        )}
      >
        {title}
      </div>
    );
  }
);

Event.displayName = 'Event';

export default Event;
