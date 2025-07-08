import clsx from 'clsx';
import Keywords from './Detail/Keywords';

const Detail = () => {
  return (
    <div
      className={clsx(
        'z-50 fixed bottom-0 right-0',
        'w-[26vw] min-w-[300px] h-[84.91vh] shadow-button-2 bg-white rounded-tl-[80px]',
        'flex flex-col items-start justify-start',
        'pl-20 pt-24 pr-16'
      )}
    >
      <Keywords
        date="1"
        keywords={[
          { keyword: 'React', frequency: 5 },
          { keyword: 'Storybook', frequency: 3 },
          { keyword: 'JavaScript', frequency: 4 },
          { keyword: 'CSS', frequency: 2 },
          { keyword: 'Testing', frequency: 1 },
        ]}
      />
    </div>
  );
};

export default Detail;
