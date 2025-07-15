import clsx from 'clsx';
import type { Category } from '../../types/IUsage';
import textStyles from '../../styles/textStyles';
import { categoryColors } from '../../styles/categoryColors';

const TotalTimes = ({
  category,
  minutes,
}: {
  category: Category;
  minutes: number;
}) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedTime = `${hours > 0 ? `${hours}시간 ` : ''}${remainingMinutes}분`;

  return (
    <div
      className={clsx(
        'flex flex-col items-start justify-center gap-2 box-border',
        'w-[250px] h-[152px] py-10 px-12 shadow-button-1 rounded-[20px]'
      )}
    >
      <span
        style={{
          color: categoryColors[category],
        }}
        className={clsx(textStyles.title3)}
      >
        {category}
      </span>
      <span className={clsx(textStyles.title3_1)}>{formattedTime}</span>
    </div>
  );
};

export default TotalTimes;
