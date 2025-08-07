import { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Keywords from './Detail/Keywords';
import Summary from './Detail/Summary';
import Statistics from './Detail/Statistics';
import Timeline from './Detail/Timeline';
import textStyles from '../../styles/textStyles';
import { motion } from 'framer-motion';
import axiosInstance from '../../lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { ISummaryResponse } from '../../types/ICalendar';
import { showErrorToast } from '../../components/Toast/showToast';

type DetailProps = {
  dateString: string;
};

const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ dateString }, ref) => {
    const [isScrollable, setIsScrollable] = useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const getDetailData = async (dateString: string) => {
      const response = await axiosInstance.get(`/api/daily/${dateString}`);
      // console.log('Detail data fetched:', response.data);
      return response.data;
    };

    const { data, isLoading, error } = useQuery<ISummaryResponse>({
      queryKey: ['detailData', dateString],
      queryFn: () => getDetailData(dateString),
      refetchOnWindowFocus: false,
      retry: 1,
    });

    if (error) {
      showErrorToast('일간 요약 정보를 불러오는데 실패했습니다.');
    }

    // 마운트 시, 그리고 items 바뀔 때 overflow 여부 체크
    useEffect(() => {
      const el = containerRef.current;
      if (el) {
        // console.log('Checking overflow:', el.scrollHeight, el.clientHeight);
        setIsOverflowing(el.scrollHeight >= el.clientHeight);
      }
    }, [data]);

    useEffect(() => {
      const el = containerRef.current;
      if (isScrollable && el) {
        el.scrollTo({ top: 0, behavior: 'auto' });
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    }, [isScrollable]);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={clsx(
          'z-50 fixed bottom-0 right-0',
          'w-[27vw] min-w-[480px] h-[84.91vh] shadow-button-2 bg-white rounded-tl-[56px] lg:rounded-tl-[80px]',
          'flex flex-col',
          isScrollable && 'overflow-hidden'
        )}
      >
        <div // 18
          ref={containerRef}
          className={clsx(
            'flex flex-col items-start justify-start gap-12 flex-1 w-full',
            'pl-15 lg:pl-20 pt-18 lg:pt-24 pr-8',
            isScrollable && 'flex-1 overflow-y-auto overflow-x-visible',
            'hide-scrollbar',
            isOverflowing ? 'pb-24' : 'pb-6'
          )}
        >
          {!isLoading && data && (
            <>
              <Keywords date={dateString} keywords={data.data.topKeywords} />
              <div className="flex flex-col items-start justify-start gap-[26px] w-full">
                <div className="flex items-center gap-2.5">
                  <div
                    aria-hidden
                    className="w-2.5 h-2.5 bg-primary-400 rounded-full"
                  />
                  <p className={`${textStyles.text2_1} text-primary-400`}>
                    AI 요약
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start gap-9 w-full">
                  <Summary summary={data.data.summaryText.join(' ')} />
                  <Statistics
                    totalUsageTimeMinutes={
                      data.data.activityStats.totalUsageTimeMinutes
                    }
                    activityProportions={
                      data.data.activityStats.activityProportions
                    }
                  />
                  <Timeline timelines={data.data.dailyTimeline} />
                </div>
              </div>
            </>
          )}
        </div>
        {isOverflowing && (
          <div
            className={clsx(
              'absolute bottom-0 left-0 w-full bg-white py-6 px-20',
              'flex items-center justify-between'
            )}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                'w-full h-12 bg-primary-500',
                textStyles.text2_2,
                'shadow-button-2 rounded-3xl',
                'hover:bg-gray-1/20 hover:cursor-pointer'
              )}
              onClick={() => {
                setIsScrollable((prev) => !prev);
              }}
            >
              {isScrollable ? '닫기' : '더보기'}
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  }
);

Detail.displayName = 'Detail';

export default Detail;
