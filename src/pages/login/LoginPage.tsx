import clsx from 'clsx';
import textStyles from '../../styles/textStyles';
import googleIcon from '../../assets/icons/googleIcon.svg';
import { motion } from 'framer-motion';
import { ChromeAuth } from '../../utils/ChromeAuth';

const LoginPage = () => {
  const handleLogin = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`,
      'oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    const messageListener = async (event: MessageEvent) => {
      console.log('OAuth message received:', event.data);
      console.log('Expected origin:', import.meta.env.VITE_CALLBACK_ORIGIN);
      console.log('Event origin:', event.origin);
      if (event.origin !== import.meta.env.VITE_CALLBACK_ORIGIN) return;

      localStorage.setItem('accessToken', event.data.accessToken);
      localStorage.setItem('refreshToken', event.data.refreshToken);
      if (event.data.type === 'oauth-success') {
        // background.js(토큰 매니저)에 저장 요청
        await ChromeAuth.saveTokens({
          accessToken: event.data.accessToken,
          refreshToken: event.data.refreshToken,
        });

        window.removeEventListener('message', messageListener);

        if (event.data.newUser) {
          window.location.hash = '/onboarding';
        } else {
          window.location.hash = '/';
        }
      }

      if (event.data.type === 'oauth-error') {
        console.error('OAuth Error:', event.data.error);
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);
  };

  return (
    <div
      className={clsx(
        'h-screen w-screen bg-white',
        'flex flex-col items-center justify-center'
      )}
    >
      <div
        className={clsx(
          'w-3/5 min-w-[600px] h-auto aspect-[610/249] py-[7.4vh] mx-auto box-border',
          'bg-gradient-to-b from-white to-[#EEEFFF]',
          'shadow-default-1',
          'rounded-4xl',
          'flex flex-col items-center justify-between gap-8'
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
            'font-roboto font-medium text-[#1F1F1F] text-[clamp(1.25rem,2.96vh,2rem)] break-keep text-nowrap',
            'w-[35vw] min-w-100 h-auto aspect-6/1 py-2.5 px-3 rounded-full',
            'flex flex-row items-center justify-center gap-11',
            'bg-white',
            'hover:cursor-pointer'
          )}
          onClick={handleLogin}
        >
          <img
            src={googleIcon}
            alt={'Google Logo'}
            // className={'inline-block h-[3.7vh] min-h-4 aspect-1/1'}
            className={'inline-block h-[3.7vh] min-h-10 aspect-1/1'}
          />
          Google 계정으로 계속하기
        </motion.button>
      </div>
    </div>
  );
};

export default LoginPage;
