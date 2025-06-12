import SearchIcon from '../assets/icons/search.png';
import RobotIcon from '../assets/icons/robot.png';
import ClockIcon from '../assets/icons/clock.png';
import NetworkIcon from '../assets/icons/network.png';

export const menuList: Array<{
  icon: string;
  title: string;
  endpoint: string;
}> = [
  {
    icon: SearchIcon,
    title: '오늘의 키워드',
    endpoint: '/todays-keyword',
  },
  {
    icon: RobotIcon,
    title: 'AI 일일 요약',
    endpoint: '/daily-summary',
  },
  {
    icon: ClockIcon,
    title: '사용시간 분포',
    endpoint: '/usage',
  },
  {
    icon: NetworkIcon,
    title: '오늘 방문 사이트',
    endpoint: '/visited-sites',
  },
];
