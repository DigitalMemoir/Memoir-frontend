import type { IDailyKeyword } from '../../../types/ICalendar';
import Contents from './Contents';
import SearchImage from '../../../assets/icons/search.png';
import textStyles from '../../../styles/textStyles';
import clsx from 'clsx';

const Keyword = ({ keyword }: { keyword: string }) => {
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-center',
        'w-30 h-12 py-3 border border-text-subtle rounded-lg',
        'flex-shrink-0'
      )}
    >
      <span className={clsx(textStyles.text1, 'text-text-subtle')}>
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
  keywords: Array<IDailyKeyword>;
}) => {
  return (
    <Contents icon={SearchImage} title={`${date}일의 키워드`}>
      <div
        className={clsx(
          'w-full -mr-100',
          'overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
        )}
      >
        <div
          className={
            'flex flex-row items-center justify-start gap-4 w-fit min-w-max'
          }
        >
          {keywords.map((item) => (
            <Keyword keyword={item.keyword} key={item.keyword} />
          ))}
        </div>
      </div>
    </Contents>
  );
};

export default Keywords;
