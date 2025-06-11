import dayjs from 'dayjs';
import textStyles from '../../styles/textStyles';
import { motion } from 'framer-motion';

const Popup = ({
  dateString,
}: {
  dateString: string;
  tailPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) => {
  const formattedDate = dayjs(dateString).format('YYYY.MM.DD (dd)');
  return (
    <div
      className={
        'w-136 h-80 bg-white px-8 pt-9 pb-5.5 \
        shadow-[0px_0px_8px_rgba(0,0,0,0.20))] \
        flex flex-col gap-6'
      }
    >
      <p className={`${textStyles.text2_2} text-text-subtle`}>
        {formattedDate}
      </p>
      <div className={'flex flex-col gap-4'}>
        <div className={'flex flex-row items-center gap-2.5'}>
          <div className={'w-2.5 h-2.5 bg-primary-400 rounded-full'} />
          <p className={`${textStyles.text2_1} text-primary-400`}>AI 요약</p>
        </div>
        <p>내용요약</p>
      </div>
      <hr />
      <div className={'flex flex-row items-center gap-4'}>
        <img
          src={'https://picsum.photos/200/300'}
          alt={'example'}
          className={'w-14 h-14 object-cover rounded-full'}
        />
        <p className={`${textStyles.text2_2} text-text-body`}>이름</p>
      </div>
      <div className={'flex flex-row-reverse w-full'}>
        <motion.button
          className={`${textStyles.sub2} text-primary-400 hover:bg-gray-1/20 p-1`}
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
