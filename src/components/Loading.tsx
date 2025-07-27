import clsx from 'clsx';
import BeatLoader from 'react-spinners/BeatLoader';

const Loading = ({
  isLoading,
  className,
}: {
  isLoading: boolean;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        'w-full h-full min-w-150 p-6 flex items-center justify-center',
        !isLoading && 'hidden',
        className
      )}
    >
      <BeatLoader loading={isLoading} color={'#8387ff'} />
    </div>
  );
};

export default Loading;
