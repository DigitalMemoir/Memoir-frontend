import clsx from 'clsx';
import textStyles from '../../styles/textStyles';
import { MotionLink } from '../../components/MotionLink';

const NotFoundErrorPage = () => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center h-screen w-full p-8',
        'fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2'
      )}
    >
      <span className="inline-block w-8 h-8 bg-primary-100 rounded-full" />

      <div className="relative text-center ">
        <h2
          className={clsx(
            'text-pretendard text-[128px] font-bold leading-none',
            'text-[#8387FF] absolute inset-0 px-8 '
          )}
          style={{
            WebkitTextStroke: '2px #8387FF',
            WebkitTextFillColor: '#8387FF',
          }}
        >
          Page Not Found
        </h2>
        <h2
          className={clsx(
            'text-pretendard text-[128px] font-bold leading-none',
            'text-transparent relative z-10 px-8'
          )}
          style={{
            WebkitTextFillColor: 'white',
          }}
        >
          Page Not Found
        </h2>
      </div>

      <p
        className={clsx(
          textStyles.title3_1,
          'whitespace-break-spaces text-center text-text-subtle pt-2'
        )}
      >{`존재하지 않는 주소를 입력하셨거나,\n요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.`}</p>
      <MotionLink
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        to={'/'}
        className={clsx(
          'w-79 h-20 py-6 mt-22 text-center',
          textStyles.title2,
          'text-primary-400 border rounded-[52px] border-primary-400'
        )}
      >
        메인으로
      </MotionLink>
    </div>
  );
};

export default NotFoundErrorPage;
