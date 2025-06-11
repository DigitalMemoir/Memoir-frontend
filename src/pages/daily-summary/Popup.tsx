import React from 'react';
import dayjs from 'dayjs';
import textStyles from '../../styles/textStyles';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import './Popup.css';
import type { IPopupProps } from '../../types/ICalendar';

const tailYPositionClasses: Record<IPopupProps['tailYPosition'], string> = {
  top: 'arrow_box_top',
  bottom: 'arrow_box_bottom',
};

const tailXPositionClasses: Record<IPopupProps['tailXPosition'], string> = {
  left: 'after:left-[10rem]',
  right: 'after:right-[10rem]',
};

const Popup: React.FC<IPopupProps> = ({
  dateString,
  tailXPosition,
  tailYPosition,
}) => {
  const formattedDate = dayjs(dateString).format('YYYY.MM.DD (dd)');
  const tailClasses = clsx(
    tailXPositionClasses[tailXPosition],
    tailYPositionClasses[tailYPosition]
  );

  return (
    <div
      className={clsx(
        'relative w-[34rem] h-[20rem] bg-white p-6 shadow-lg flex flex-col gap-6',
        tailClasses,
        'z-[500]'
      )}
    >
      <p className={`${textStyles.text2_2} text-text-subtle`}>
        {formattedDate}
      </p>

      <div className={'flex flex-col gap-4'}>
        <div className={'flex items-center gap-2.5'}>
          <div className={'w-2.5 h-2.5 bg-primary-400 rounded-full'} />
          <p className={`${textStyles.text2_1} text-primary-400`}>AI 요약</p>
        </div>
        <p className={clsx(textStyles.text2, 'text-text-body')}>내용요약</p>
      </div>

      <hr className={'border-gray-200'} />

      <div className={'flex items-center gap-4'}>
        <img
          src={'https://picsum.photos/200'}
          alt={'example'}
          className={'w-14 h-14 object-cover rounded-full'}
        />
        <p className={`${textStyles.text2_2} text-text-body`}>이름</p>
      </div>

      <div className={'flex justify-end'}>
        <motion.button
          className={`${textStyles.sub2} text-primary-400 hover:bg-primary-400/20 px-3 py-1 rounded`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          자세히보기
        </motion.button>
      </div>
    </div>
  );
};

export default Popup;
