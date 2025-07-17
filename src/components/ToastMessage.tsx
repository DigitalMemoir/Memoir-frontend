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
}: {
  onDismiss: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className={'w-full h-full flex flex-row items-center justify-between'}>
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
