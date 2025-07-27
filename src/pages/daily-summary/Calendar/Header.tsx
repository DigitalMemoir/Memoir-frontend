import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import textStyles from '../../../styles/textStyles';

const Header = ({
  goPrev,
  goNext,
  title,
}: {
  goPrev: () => void;
  goNext: () => void;
  title: string;
}) => {
  return (
    <div className={'flex flex-row items-center justify-center mb-14 gap-24'}>
      <button
        onClick={goPrev}
        className={'w-10 h-10 flex items-center justify-center'}
      >
        <ChevronLeftIcon className={'text-gray-3 stroke-4 h-6'} />
      </button>
      <p className={`${textStyles.title2}`}>{title}</p>
      <button
        onClick={goNext}
        className={'w-10 h-10 flex items-center justify-center'}
      >
        <ChevronRightIcon className={'text-gray-3 stroke-4 h-6'} />
      </button>
    </div>
  );
};

export default Header;
