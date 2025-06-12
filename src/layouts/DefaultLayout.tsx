import { useEffect, useState } from 'react';
import Drawer from '../components/Drawer';
import BellIcon from '../assets/icons/Bell.svg';
import { Outlet, useLocation } from 'react-router-dom';
import GoogleSearchBar from '../components/GoogleSearchBar';
import { motion } from 'framer-motion';

const DefaultLayout = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pt, setPt] = useState<string>('304px');
  const { pathname } = useLocation();

  useEffect(() => {
    setPt(pathname === '/' ? '304px' : '168px');

    return () => {};
  }, [pathname]);

  return (
    <motion.div
      className={`w-screen h-screen box-border`}
      animate={{ paddingTop: pt }}
      transition={{ duration: 0.3 }}
    >
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
      <main className={`w-fit mx-auto relative box-border`}>
        <GoogleSearchBar />
        <Outlet />
      </main>
    </motion.div>
  );
};

export default DefaultLayout;
