import React, { useState } from 'react';
import Drawer from '../components/Drawer';
import BellIcon from '../assets/icons/Bell.svg';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className={'w-screen h-screen pt-42'}>
      <Drawer
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
      <div
        className={'absolute top-13 right-9 flex flex-row items-center gap-10'}
      >
        <img src={BellIcon} className={'w-11 h-11 px-0.5  text-gray-3'} />
        <img
          src={'https://picsum.photos/80'}
          className={'w-20 h-20 rounded-full'}
        />
      </div>
      {children}
    </div>
  );
};

export default DefaultLayout;
