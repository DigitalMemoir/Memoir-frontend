import { Bars3Icon } from '@heroicons/react/16/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { menuList } from './menuList';
import MenuItem from './MenuItem';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/icons/memoir-logo.png';
import clsx from 'clsx';

const DrawerButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className={
        'absolute top-[7.04vh] left-[2.29vw] flex flex-row items-center justify-center gap-4'
      }
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={
          'min-w-4.5 min-h-4.5 w-auto h-[3.33vh] aspect-square px-0.5 py-1.5 bg-white hover:bg-gray-1/20 hover:cursor-pointer'
        }
      >
        <Bars3Icon
          className={
            'w-auto h-[2.22vh] min-w-4 min-h-3 aspect-[4/3] color-black '
          }
        />
      </motion.button>
      <Link to={'/'}>
        <img
          src={Logo}
          alt={'Memoir Logo'}
          // className={'w-[7.5vw] h-auto min-w- min-h-10 aspect-[144/32]'}
          className={clsx(
            'w-[7.5vw] min-w-[72px] min-h-[1rem] h-auto aspect-[144/32]'
          )}
        />
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
            className={clsx(
              'fixed top-0 left-0 w-[16.67vw] min-w-[240px] h-full bg-white',
              'z-[50] shadow-[5px_0px_10px_3px_rgba(0,0,0,0.05)]'
            )}
          >
            <DrawerButton onClick={onClose} />
            <div
              className={clsx(
                'flex flex-col items-center justify-center gap-4',
                'absolute top-[22.96vh] w-full h-fit mx-auto'
              )}
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
