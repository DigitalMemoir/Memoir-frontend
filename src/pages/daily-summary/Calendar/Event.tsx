import type { EventContentArg } from '@fullcalendar/core/index.js';
import clsx from 'clsx';
import textStyles from '../../../styles/textStyles';
import Popup from '../Popup';

interface IEventProps extends EventContentArg {
  popupOpen?: boolean;
}

const colorPalette = [
  'bg-[#FFF3BD]',
  'bg-[#CFFFCF]',
  'bg-[#FFD6D6]',
  'bg-[#B9F6FF]',
  'bg-[#DEC1FF]',
];

const getColorClass = (key: string): string => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

const Event = (props: IEventProps) => {
  const colorClass = getColorClass(props.event.title);
  return (
    <>
      <div
        className={clsx(
          colorClass,
          'w-full h-5 pl-3',
          'flex flex-row items-center justify-start',
          textStyles.sub2,
          'text-text-body',
          'cursor-default',
          'absolute'
        )}
      >
        {props.event.title}
      </div>
      {props.popupOpen && (
        <div className={'absolute top-[100%] left-0'}>
          <Popup
            dateString={props.event.startStr}
            tailYPosition={'top'}
            tailXPosition={'left'}
          />
        </div>
      )}
    </>
  );
};

export default Event;
