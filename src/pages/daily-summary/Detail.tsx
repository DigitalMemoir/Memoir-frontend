import clsx from 'clsx';
import Keywords from './Detail/Keywords';
import Summary from './Detail/Summary';
import Statistics from './Detail/Statistics';
import Timeline from './Detail/Timeline';

const Detail = () => {
  const activities = {
    totalUsageTimeMinutes: 185,
    activityProportions: [
      {
        category: '업무, 프로젝트',
        percentage: 27,
      },
      {
        category: '공부, 학습',
        percentage: 65,
      },
      {
        category: '쇼핑',
        percentage: 8,
      },
    ],
  };

  const dailyTimeline = [
    {
      time: '09:00',
      description: 'Spring Boot @Transactional 이해와 사용법 학습',
    },
    {
      time: '11:00',
      description: 'GitHub - openai/openai-java 프로젝트 확인',
    },
    {
      time: '13:00',
      description: 'YouTube - Spring Security 기초 강의 시청',
    },
    {
      time: '15:00',
      description: 'Stack Overflow - CORS 에러 해결 방법 학습',
    },
    {
      time: '17:00',
      description: '쿠팡에서 개발자 장비 특가 확인',
    },
    {
      time: '19:00',
      description: 'Notion을 이용한 프로젝트 회의록 작성',
    },
  ];
  return (
    <div
      className={clsx(
        'z-50 fixed bottom-0 right-0',
        'w-[26vw] min-w-[300px] h-[84.91vh] shadow-button-2 bg-white rounded-tl-[80px]',
        'flex flex-col items-start justify-start',
        'pl-20 pt-24 pr-8 gap-12'
      )}
    >
      <Keywords
        date="1"
        keywords={[
          { keyword: 'React', frequency: 5 },
          { keyword: 'Storybook', frequency: 3 },
          { keyword: 'JavaScript', frequency: 4 },
          { keyword: 'CSS', frequency: 2 },
          { keyword: 'Testing', frequency: 1 },
        ]}
      />
      <div className={'flex flex-col items-start justify-start gap-9 w-full'}>
        <Summary summary="오늘은 React와 Storybook을 사용하여 컴포넌트를 개발하고, JavaScript와 CSS를 활용하여 스타일링을 적용했습니다. 또한, 테스트 케이스를 작성하여 코드의 안정성을 높였습니다." />
        <Statistics
          totalUsageTimeMinutes={activities.totalUsageTimeMinutes}
          activityProportions={activities.activityProportions}
        />
        <Timeline timelines={dailyTimeline} />
      </div>
    </div>
  );
};

export default Detail;
