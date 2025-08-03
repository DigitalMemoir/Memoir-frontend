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
  return toast.promise(
    asyncFn(),
    {
      loading: (
        <CustomToastMessage
          toastType={'loading'}
          onDismiss={() => toast.dismiss()}
        >
          {loadingMsg}
        </CustomToastMessage>
      ),
      success: (
        <CustomToastMessage
          toastType={'success'}
          onDismiss={() => toast.dismiss()}
        >
          {successMsg}
        </CustomToastMessage>
      ),
      error: (
        <CustomToastMessage
          toastType={'loading'}
          onDismiss={() => toast.dismiss()}
        >
          {errorMsg}
        </CustomToastMessage>
      ),
    },
    {
      position: toastOption.position,
      style: toastOption.style,
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
    toastOption
  );
