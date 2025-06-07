import { Bars3Icon } from '@heroicons/react/16/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { menuList } from './menuList';
import MenuItem from './MenuItem';
import { useLocation } from 'react-router-dom';

const Drawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const location = useLocation();

  const selectedEndpoint = location.pathname || '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={
            'fixed top-0 left-0 w-80 h-full bg-white \
        z-[50] shadow-[5px_0px_10px_3px_rgba(0,0,0,0.05)]'
          }
        >
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={
              'absolute w-9 h-9 px-2 py-2.5 bg-white hover:bg-gray-1/20  \
          top-19 left-11'
            }
          >
            <Bars3Icon className={'w-5 h-4 color-black '} />
          </motion.button>
          <div
            className={
              'flex flex-col items-center justify-center gap-4 \
              absolute top-62 w-full h-fit mx-auto'
            }
          >
            {menuList.map((item) => (
              <MenuItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                endpoint={item.endpoint}
                selected={selectedEndpoint.startsWith(item.endpoint)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
