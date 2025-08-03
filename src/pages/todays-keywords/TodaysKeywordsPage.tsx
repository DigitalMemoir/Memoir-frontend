import dayjs from 'dayjs';
import SearchIcon from '../../assets/icons/search.png';
import axiosInstance from '../../lib/axiosInstance';
import textStyles from '../../styles/textStyles';
import { getBrowsingHistory } from '../../utils/getBrowsingHistory';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { IKeywordResponse } from '../../types/ITodaysKeywords';
import type { IVisitedPage } from '../../types/IVisitedPages';
import { showErrorToast } from '../../components/Toast/showToast';
import Keyword from './Keyword';
import Loading from '../../components/Loading';
import clsx from 'clsx';

// 하나의 방문 페이지를 나타내는 인터페이스 임시!
export interface VisitedPage {
  title: string;
  url: string;
  visitCount: number;
  duration: number;
}

const TodaysKeywordsPage = () => {
  const today = dayjs().format('YYYY-MM-DD');
  const getTodaysKeywords = async () => {
    const browsingHistory = await getBrowsingHistory(
      dayjs().format('YYYY-MM-DD')
    );

    if (browsingHistory.length === 0) {
      showErrorToast('오늘의 방문 기록이 없습니다.');
      return { keywordFrequencies: [] };
    }

    const requestBody = browsingHistory.map((page: IVisitedPage) => ({
      title: page.title,
      url: page.url,
      visitCount: page.visitCount,
      duration: page.durationSeconds,
    }));

    const response = await axiosInstance.post('/api/keywords/analyze', {
      visitedPages: requestBody,
    });

    return response.data;
  };

  const { data, isLoading, error } = useQuery<IKeywordResponse>({
    queryKey: ['todaysKeywords', today],
    queryFn: getTodaysKeywords,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (error) {
    showErrorToast('오늘의 키워드를 불러오지 못했어요.\n다시 시도해주세요.');
    return (
      <div className={'w-fit h-full box-border pt-[11.11vh]'}>
        <p className={`${textStyles.sub1} text-text-subtle`}>
          키워드를 불러오는 데 실패했어요. 다시 시도해주세요.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div
        className={clsx(
          'flex flex-col items-center justify-start w-full pt-[11.11vh]'
        )}
      >
        <Loading isLoading={isLoading || !data} />
      </div>

      <div className={'w-fit h-full box-border'}>
        {!isLoading && data && (
          <motion.div
            className={
              'pl-9 max-w-[740px] h-full flex flex-col items-start justify-start gap-[7.41vh] box-border'
            }
            variants={containerVariants}
            initial={'initial'}
            animate={'animate'}
            exit={'exit'}
          >
            <motion.div
              variants={itemVariants}
              className={'flex flex-col items-start justify-start gap-4 w-full'}
            >
              <img
                src={SearchIcon}
                alt={'Search Icon'}
                className={'w-[2.5vw] h-auto aspect-square min-h-6 min-w-6'}
              />
              <h2 className={`${textStyles.title1} text-text-title`}>
                오늘의 키워드
              </h2>
              <p className={`${textStyles.sub1} text-text-subtle`}>
                Memoir가 사용자님의 ‘오늘의 키워드’ 를 뽑아봤어요.
              </p>
            </motion.div>
            <div className={'grid grid-cols-3 gap-y-6 gap-x-4'}>
              {data.data.keywordFrequencies?.map((keyword, idx) => {
                if (idx >= 9) return null; // 9개까지만 렌더링
                return (
                  <motion.div
                    key={`${keyword.keyword}-${idx}`}
                    variants={itemVariants}
                  >
                    <Keyword
                      key={`${keyword.keyword}-${idx}`}
                      keyword={keyword.keyword}
                      idx={idx}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default TodaysKeywordsPage;
