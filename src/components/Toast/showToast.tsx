import toast from 'react-hot-toast';
import CustomToastMessage from '../ToastMessage';
import { toastOption } from './toastOptions';

export const showLoadingToast = ({
  loadingMsg,
  errorMsg,
  successMsg,
  asyncFn,
}: {
  loadingMsg: string;
  errorMsg: string;
  successMsg: string;
  asyncFn: () => Promise<unknown>;
}) => {
  const id = toast.loading(<></>, {
    ...toastOption,
    duration: Infinity,
    style: { display: 'none' },
  });

  return toast.promise(
    asyncFn(),
    {
      loading: (
        <CustomToastMessage
          toastType={'loading'}
          onDismiss={() => toast.dismiss(id)}
        >
          {loadingMsg}
        </CustomToastMessage>
      ),
      success: (
        <CustomToastMessage
          toastType={'success'}
          onDismiss={() => toast.dismiss(id)}
        >
          {successMsg}
        </CustomToastMessage>
      ),
      error: (
        <CustomToastMessage
          toastType={'loading'}
          onDismiss={() => toast.dismiss(id)}
        >
          {errorMsg}
        </CustomToastMessage>
      ),
    },
    {
      position: 'top-right',
      style: {
        width: 'fit-content',
        height: 'fit-content',
        margin: '0',
        boxShadow: 'none',
        maxWidth: '352px',
        backgroundColor: 'transparent',
      },
      icon: null,
    }
  );
};

export const showErrorToast = (msg: string) =>
  toast.error(
    (t) => (
      <CustomToastMessage
        toastType="error"
        onDismiss={() => toast.dismiss(t.id)}
      >
        {msg}
      </CustomToastMessage>
    ),
    toastOption
  );

export const showSuccessToast = (msg: string) =>
  toast.success(
    (t) => (
      <CustomToastMessage
        toastType="success"
        onDismiss={() => toast.dismiss(t.id)}
      >
        {msg}
      </CustomToastMessage>
    ),
    toastOption
  );

export const showInfoToast = (msg: string) =>
  toast.loading(
    (t) => (
      <CustomToastMessage
        toastType="info"
        onDismiss={() => toast.dismiss(t.id)}
      >
        {msg}
      </CustomToastMessage>
    ),
    {
      ...toastOption,
      duration: 3000,
      style: {
        width: 'fit-content',
        height: 'fit-content',
        margin: '0',
        boxShadow: 'none',
        maxWidth: '352px',
        backgroundColor: 'transparent',
      },
      icon: null,
    }
  );
