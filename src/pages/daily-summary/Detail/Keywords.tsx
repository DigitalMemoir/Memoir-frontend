import type { ITopKeywords } from '../../../types/ICalendar';
import Contents from './Contents';
import SearchImage from '../../../assets/icons/search.png';
import textStyles from '../../../styles/textStyles';
import clsx from 'clsx';
import dayjs from 'dayjs';

const Keyword = ({ keyword }: { keyword: string }) => {
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-center',
        'w-30 h-12 px-3 py-3 border border-text-subtle rounded-lg',
        'flex-shrink-0'
      )}
    >
      <span
        className={clsx(
          textStyles.text1,
          'text-text-subtle truncate',
          'cursor-default select-none'
        )}
      >
        {keyword}
      </span>
    </div>
  );
};

const Keywords = ({
  date,
  keywords,
}: {
  date: string;
  keywords: Array<ITopKeywords>;
}) => {
  const formattedDate = dayjs(date).format('DD');
  return (
    <Contents icon={SearchImage} title={`${formattedDate}일의 키워드`}>
      <div className="flex flex-row items-center justify-start gap-4 pr-4">
        {keywords.map((item) => (
          <Keyword keyword={item.keyword} key={item.keyword} />
        ))}
      </div>
    </Contents>
  );
};

export default Keywords;
