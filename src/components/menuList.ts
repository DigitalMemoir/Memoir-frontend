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
    title: '검색',
    endpoint: '/search',
  },
  {
    icon: RobotIcon,
    title: 'AI',
    endpoint: '/ai',
  },
  {
    icon: ClockIcon,
    title: '사용시간 분포',
    endpoint: '/usage',
  },
  {
    icon: NetworkIcon,
    title: '네트워크 상태',
    endpoint: '/network',
  },
];
