import clsx from 'clsx';
import textStyles from '../../styles/textStyles';
import googleIcon from '../../assets/icons/googleIcon.svg';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

interface ILoginResponse {
  token: string;
}

const LoginPage = () => {
  const handleLogin = async () => {
    const response = await axios.post(`${import.meta.env}/login`);
    return response.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleLogin,
    onSuccess: (data: ILoginResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/';
    },
    onError: (error: AxiosError) => {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    },
  });

  return (
    <div
      className={clsx(
        'h-screen w-screen bg-white',
        'flex flex-col items-center justify-center'
      )}
    >
      <div
        className={clsx(
          'w-3/5 min-w-[600px] h-auto aspect-[610/249] py-20 mx-auto',
          'bg-gradient-to-b from-white to-[#EEEFFF]',
          'shadow-default-1',
          'rounded-4xl',
          'flex flex-col items-center justify-between '
        )}
      >
        <h4
          style={{ textAlign: 'center' }}
          className={clsx(
            textStyles.title1,
            'w-full',
            'text-text-body',
            'block'
          )}
        >
          당신의 기록이, 당신의 이야기로.
          <br />
          Memoir 에서 오늘을 시작하세요!
        </h4>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={clsx(
            'box-border border-[1px] border-[#747775]',
            'font-roboto font-medium text-[#1F1F1F] text-[2rem]',
            'w-1/2 min-w-75 h-auto aspect-6/1 py-2.5 px-3 rounded-full',
            'flex flex-row items-center justify-center gap-11',
            'bg-white',
            'hover:cursor-pointer'
          )}
          onClick={() => mutate()}
        >
          <img
            src={googleIcon}
            alt={'Google Logo'}
            className={'inline-block w-10 h-10 '}
          />
          Google 계정으로 계속하기
        </motion.button>
      </div>
    </div>
  );
};

export default LoginPage;
