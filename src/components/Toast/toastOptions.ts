import type { ToastOptions } from 'react-hot-toast';

export const toastOption: ToastOptions = {
  position: 'top-right',
  duration: 3000,
  style: {
    width: 'fit-content',
    height: 'fit-content',
    margin: '0',
    boxShadow: 'none',
    maxWidth: '100%',
    backgroundColor: 'transparent',
  },
  icon: null,
};
