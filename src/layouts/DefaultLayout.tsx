import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GoogleSearchBar from '../components/GoogleSearchBar';
import { motion } from 'framer-motion';

const DefaultLayout = () => {
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
      <main className={`w-fit mx-auto relative box-border`}>
        <GoogleSearchBar />
        <Outlet />
      </main>
    </motion.div>
  );
};

export default DefaultLayout;
