import type React from 'react';
import textStyles from '../styles/textStyles';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/16/solid';

// toast(
//   (t: Toast) => (
//     <span>
//       Custom and <b>bold</b>
//       <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
//     </span>
//   ),
//   {
//     icon: <Icon />,
//   }
// );

const CustomToastMessage = ({
  onDismiss,
  children,
  toastType = 'success',
}: {
  onDismiss: () => void;
  children: React.ReactNode;
  toastType?: 'error' | 'success' | 'info' | 'loading';
}) => {
  let backgroundColorClass = '';
  switch (toastType) {
    case 'error':
      backgroundColorClass = 'bg-[#FF473A]';
      break;
    case 'success':
      backgroundColorClass = 'bg-[#53D900]';
      break;
    case 'info':
      backgroundColorClass = 'bg-primary-400';
      break;
    case 'loading':
      backgroundColorClass = 'bg-primary-400';
      break;
    default:
      backgroundColorClass = 'bg-[#53D900]';
      break;
  }
  return (
    <div
      className={clsx(
        'min-w-88 w-fit h-18 flex flex-row items-center justify-between',
        backgroundColorClass,
        'rounded-[10px] p-6 pr-3'
      )}
    >
      <span className={clsx(textStyles.text1, 'text-white')}>{children}</span>
      <button
        className={clsx(
          textStyles.text1,
          'text-white hover:text-gray-200 focus:outline-none'
        )}
        onClick={onDismiss}
      >
        <XMarkIcon className="w-6 h-6 p-1 text-white hover:cursor-pointer" />
      </button>
    </div>
  );
};

export default CustomToastMessage;
