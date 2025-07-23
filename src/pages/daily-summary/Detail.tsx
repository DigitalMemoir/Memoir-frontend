import { forwardRef } from 'react';
import clsx from 'clsx';
import Keywords from './Detail/Keywords';
import Summary from './Detail/Summary';
// import Statistics from './Detail/Statistics';
import Timeline from './Detail/Timeline';
import textStyles from '../../styles/textStyles';
import { motion } from 'framer-motion';
import axiosInstance from '../../lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { ISummaryResponse } from '../../types/ICalendar';

type DetailProps = {
  dateString: string;
};

const Detail = forwardRef<HTMLDivElement, DetailProps>(
  ({ dateString }, ref) => {
    const getDetailData = async (dateString: string) => {
      const response = await axiosInstance.get(`/api/daily/${dateString}`);
      return response.data;
    };

    const { data, isLoading, error } = useQuery<ISummaryResponse>({
      queryKey: ['detailData', dateString],
      queryFn: () => getDetailData(dateString),
      refetchOnWindowFocus: false,
      retry: 1,
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={clsx(
          'z-50 fixed bottom-0 right-0',
          'w-[26vw] min-w-[480px] h-[84.91vh] shadow-button-2 bg-white rounded-tl-[56px] lg:rounded-tl-[80px]',
          'flex flex-col items-start justify-start',
          'pl-15 lg:pl-20 pt-18 lg:pt-24 pr-8 gap-12'
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
                <Summary summary="오늘은 React와 Storybook을 사용하여 컴포넌트를 개발하고, JavaScript와 CSS를 활용하여 스타일링을 적용했습니다. 또한, 테스트 케이스를 작성하여 코드의 안정성을 높였습니다." />
                {/* <Statistics
                  totalUsageTimeMinutes={
                    data.data.activityStats.totalUsageTimeMinutes
                  }
                  activityProportions={data.data.activityStats.categorySummaries}
                /> */}
                <Timeline timelines={data.data.dailyTimeline} />
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  }
);

Detail.displayName = 'Detail';

export default Detail;
