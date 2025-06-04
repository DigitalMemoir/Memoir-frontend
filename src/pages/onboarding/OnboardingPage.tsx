import textStyles from '../../styles/textStyles';
import KeywordList from './KeywordList';

const OnboardingPage = () => {
  return (
    <div
      className={
        'flex flex-col items-center justify-center max-w-[85vw] mx-auto h-dvh'
      }
    >
      <div
        className={
          'm-full h-fit flex flex-col items-start justify-center gap-25'
        }
      >
        <div className={'flex flex-col items-start justify-center gap-4'}>
          <h2 className={`${textStyles.title1} text-title`}>
            어떤 목적으로 웹을 사용하시나요?
          </h2>
          <p className={`${textStyles.sub1} text-[var(--color-muted)]`}>
            Memoir가 그 흔적을 담아, 하루를 이야기로 정리해드릴게요.
          </p>
        </div>
        <KeywordList />
        <div
          aria-hidden
          className={'flex flex-col items-start justify-center gap-4'}
        >
          <h2 aria-hidden className={`${textStyles.title1} text-title`}>
            {' '}
          </h2>
          <p
            aria-hidden
            className={`${textStyles.sub1} text-[var(--color-muted)]`}
          >
            {' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
