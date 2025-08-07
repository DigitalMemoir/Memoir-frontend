import clsx from 'clsx';
import textStyles from '../../styles/textStyles';

const Keyword = ({ idx, keyword }: { idx: number; keyword: string }) => {
  const getBorderTextClasses = (idx: number): string => {
    switch (idx) {
      case 0:
        return 'border-primary-400 text-primary-400';
      case 1:
        return 'border-primary-300 text-primary-300';
      case 2:
        return 'border-primary-200 text-primary-200';
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      default:
        return 'border-gray-2 text-gray-2';
    }
  };

  const colorClasses = getBorderTextClasses(idx);

  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-center w-[11.67vw] h-auto min-w-[180px] aspect-[7/2] box-border',
        'border rounded-2xl',
        textStyles.title3,
        'py-4 px-2 rounded-2xl cursor-default truncate',
        colorClasses
      )}
    >
      {keyword}
    </div>
  );
};

export default Keyword;
