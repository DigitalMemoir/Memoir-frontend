import { Bars3Icon } from '@heroicons/react/16/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { menuList } from './menuList';
import MenuItem from './MenuItem';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/icons/memoir-logo.png';

const DrawerButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={'absolute top-19 left-11 flex flex-row items-center gap-4'}>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={
          'w-9 h-9 px-0.5 py-1.5 bg-white hover:bg-gray-1/20 hover:cursor-pointer'
        }
      >
        <Bars3Icon className={'w-8 h-6 color-black '} />
      </motion.button>
      <Link to={'/'}>
        <img src={Logo} alt={'Memoir Logo'} className={'w-[144px] h-[32px]'} />
      </Link>
    </div>
  );
};

const Drawer = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const location = useLocation();

  const selectedEndpoint = location.pathname || '';

  return (
    <>
      <DrawerButton onClick={onOpen} />
      <AnimatePresence mode={'wait'}>
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
            <DrawerButton onClick={onClose} />
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
    </>
  );
};

export default Drawer;
