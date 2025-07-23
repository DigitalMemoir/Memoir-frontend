import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import textStyles from '../../styles/textStyles';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import './Popup.css';
import { showErrorToast } from '../../components/Toast/showToast';
import axiosInstance from '../../lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { IPopupResponse, IPopupProps } from '../../types/IPopup';
import Detail from './Detail';
import { useState } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const tailYPositionClasses: Record<IPopupProps['tailYPosition'], string> = {
  top: 'arrow_box_top',
  bottom: 'arrow_box_bottom',
};

const tailXPositionClasses: Record<IPopupProps['tailXPosition'], string> = {
  left: 'after:left-[10rem] before:left-[10rem]',
  right: 'after:right-[10rem] before:right-[10rem]',
};

const popupVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
};

const Popup = forwardRef<HTMLDivElement, IPopupProps>(
  ({ dateString, tailXPosition, tailYPosition }, ref) => {
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const day = dayjs(dateString);
    const formattedDate = day.format('YYYY.MM.DD (dd)');
    const tailClasses = clsx(
      tailXPositionClasses[tailXPosition],
      tailYPositionClasses[tailYPosition]
    );

    // 외부 클릭 감지
    useOnClickOutside(ref as React.RefObject<HTMLDivElement>, () => {
      if (openDetail) setOpenDetail(false);
    });

    const getPopupContent = async (date: string) => {
      const formatted = dayjs(date).format('YYYY-MM-DD');
      const response = await axiosInstance.get<IPopupResponse>(
        `/api/daily/popup/${formatted}`
      );
      return response.data;
    };

    const { data, isLoading, error } = useQuery<IPopupResponse>({
      queryKey: ['popupData', dateString],
      queryFn: () => getPopupContent(dateString),
      refetchOnWindowFocus: false,
      retry: 1,
    });

    if (error) {
      showErrorToast(`요약을 불러오지 못했어요.\n다시 시도해주세요.`);
    }

    return (
      <>
        {!openDetail && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={popupVariants}
            className={clsx(
              'relative w-[34rem] h-fit min-h-[20rem] bg-white p-6 flex flex-col gap-6',
              tailClasses,
              'z-[500] shadow-lg'
            )}
          >
            <p className={`${textStyles.text2_2} text-text-subtle`}>
              {formattedDate}
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  aria-hidden
                  className="w-2.5 h-2.5 bg-primary-400 rounded-full"
                />
                <p className={`${textStyles.text2_1} text-primary-400`}>
                  AI 요약
                </p>
              </div>
              <p className={clsx(textStyles.text2, 'text-text-body')}>
                {isLoading || !data
                  ? '요약을 불러오는 중...'
                  : data.data.title.join(' ')}
              </p>
            </div>

            <hr className="border-gray-200" />

            <div className="flex items-center gap-4">
              <img
                src="https://picsum.photos/200"
                alt="example"
                className="w-14 h-14 object-cover rounded-full"
              />
              <p className={`${textStyles.text2_2} text-text-body`}>이름</p>
            </div>

            <div className="flex justify-end">
              <motion.button
                onClick={() => setOpenDetail(true)}
                className={`${textStyles.sub2} text-primary-400 hover:bg-primary-400/20 px-3 py-1 rounded`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                자세히보기
              </motion.button>
            </div>
          </motion.div>
        )}
        {openDetail && (
          <Detail
            ref={ref as React.RefObject<HTMLDivElement>}
            dateString={day.format('YYYY-MM-DD')}
          />
        )}
      </>
    );
  }
);

Popup.displayName = 'Popup';

export default Popup;
