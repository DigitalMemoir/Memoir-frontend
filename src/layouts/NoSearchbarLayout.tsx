import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDrawerStore } from '../states/useDrawerStore';

const NoSearchbarLayout = () => {
  const { isOpen } = useDrawerStore();

  return (
    <motion.div
      className={`w-screen h-screen box-border pt-18 overflow-hidden`}
      transition={{ duration: 0.3 }}
    >
      <motion.main
        className={`h-[calc(100dvh-72px)] w-full mx-auto ${isOpen ?? 'ml-[356px]'}`}
      >
        <Outlet />
      </motion.main>
    </motion.div>
  );
};

export default NoSearchbarLayout;
