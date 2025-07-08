import type React from 'react';
import textStyles from '../../../styles/textStyles';

const Contents = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={'flex flex-col items-start justify-start gap-6 w-full'}>
      <div className={'flex flex-row items-center justify-start gap-4'}>
        <img
          src={icon}
          alt="icon"
          className={'h-[1.48vh] w-auto min-h-4 aspect-square'}
        />
        <h4 className={textStyles.text1}>{title}</h4>
      </div>
      {children}
    </div>
  );
};

export default Contents;
