import pencilIcon from '@/assets/icons/pencil.png';
import newsIcon from '@/assets/icons/news.png';
import headsetIcon from '@/assets/icons/headset.png';
import briefcaseIcon from '@/assets/icons/briefcase.png';
import shoppingBagIcon from '@/assets/icons/shoppingbag.png';

const keywords: Array<{
  icon: string;
  keyword: string;
  type: 'WORK' | 'STUDY' | 'SHOPPING' | 'NEWS' | 'CONTENTS';
}> = [
  {
    icon: pencilIcon,
    keyword: '공부, 학습',
    type: 'STUDY',
  },
  {
    icon: newsIcon,
    keyword: '뉴스, 정보 탐색',
    type: 'NEWS',
  },
  {
    icon: headsetIcon,
    keyword: '콘텐츠 소비',
    type: 'CONTENTS',
  },
  {
    icon: briefcaseIcon,
    keyword: '업무, 프로젝트',
    type: 'WORK',
  },
  {
    icon: shoppingBagIcon,
    keyword: '쇼핑',
    type: 'SHOPPING',
  },
];

export { keywords };
