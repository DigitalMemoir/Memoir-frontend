import SearchIcon from '../../assets/icons/search.png';
import textStyles from '../../styles/textStyles';
import Keyword from './Keyword';
import { motion, AnimatePresence } from 'framer-motion';

const TodaysKeywordsPage = () => {
  const keywords = [
    '오늘의 날씨',
    '오늘의 뉴스',
    '오늘의 키워드',
    '오늘의 일정',
    '오늘의 명언',
    '오늘의 기분',
    '오늘의 음악',
    '오늘의 영화',
    '오늘의 책',
    '오늘의 운동',
    '오늘의 요리',
    '오늘의 여행',
    '오늘의 취미',
    '오늘의 게임',
    '오늘의 패션',
  ];

  const nineKeywords = keywords.slice(0, 9);

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

  return (
    <AnimatePresence>
      <div className={'w-fit h-full box-border pt-[11.11vh]'}>
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
            {nineKeywords.map((keyword, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Keyword keyword={keyword} idx={idx} key={idx} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TodaysKeywordsPage;
