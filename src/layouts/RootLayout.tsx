import Drawer from '../components/Drawer';
import BellIcon from '../assets/icons/Bell.svg';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDrawerStore } from '../states/useDrawerStore';
import axiosInstance from '../lib/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { IProfile } from '../types/IProfile';
import { useProfile } from '../states/useProfile';

const RootLayout = () => {
  const { isOpen, openDrawer, closeDrawer } = useDrawerStore();

  const { setProfile } = useProfile();

  const getProfile = async () => {
    const response = await axiosInstance.get('/api/users/profile');

    setProfile(response.data.data);

    return response.data.data;
  };

  const { data } = useQuery<IProfile>({
    queryKey: ['profileData'],
    queryFn: getProfile,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <motion.div
      className={`w-screen h-screen box-border`}
      transition={{ duration: 0.3 }}
    >
      <Drawer isOpen={isOpen} onOpen={openDrawer} onClose={closeDrawer} />
      <div
        className={
          'absolute top-13 right-5 lg:right-9 flex flex-row items-center gap-6 lg:gap-10'
        }
      >
        <img
          src={BellIcon}
          className={
            'w-[2.08vw] h-[4.07vh] px-0.5 text-gray-3 min-w-8 min-h-8 max-w-10 max-h-10'
          }
        />
        <img
          referrerPolicy="no-referrer"
          src={data?.profileUrl}
          className={
            'w-[4.17vw] h-auto aspect-square rounded-full min-w-14 min-h-14 max-w-20 max-h-20'
          }
        />
      </div>
      <Outlet />
    </motion.div>
  );
};

export default RootLayout;
