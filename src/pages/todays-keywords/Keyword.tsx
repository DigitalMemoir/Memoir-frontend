import clsx from 'clsx';
import textStyles from '../../styles/textStyles';

const Keyword = ({ idx, keyword }: { idx: number; keyword: string }) => {
  const colors: Array<string> = [
    'primary-400',
    'primary-300',
    'primary-200',
    'gray-2',
    'gray-2',
    'gray-2',
    'gray-2',
    'gray-2',
    'gray-2',
  ];

  const color = colors[idx];

  console.log(
    `Keyword component rendered with idx: ${idx}, keyword: ${keyword}, color: ${color}`
  );

  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-center w-56 h-16',
        'border rounded-2xl',
        textStyles.title3,
        'py-4 px-2 rounded-2xl cursor-default',
        `border-${color}`,
        `text-${color}`
      )}
    >
      {keyword}
    </div>
  );
};

export default Keyword;
