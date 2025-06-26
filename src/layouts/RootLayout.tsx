import Drawer from '../components/Drawer';
import BellIcon from '../assets/icons/Bell.svg';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDrawer } from '../states/useDrawer';

const RootLayout = () => {
  const { isOpen, openDrawer, closeDrawer } = useDrawer();

  return (
    <motion.div
      className={`w-screen h-screen box-border`}
      transition={{ duration: 0.3 }}
    >
      <Drawer isOpen={isOpen} onOpen={openDrawer} onClose={closeDrawer} />
      <div
        className={'absolute top-13 right-9 flex flex-row items-center gap-10'}
      >
        <img src={BellIcon} className={'w-11 h-11 px-0.5  text-gray-3'} />
        <img
          src={'https://picsum.photos/80'}
          className={'w-20 h-20 rounded-full'}
        />
      </div>
      <Outlet />
    </motion.div>
  );
};

export default RootLayout;
