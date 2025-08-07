import type { Meta, StoryObj } from '@storybook/react-vite';
import Keyword from './Keyword';

const meta: Meta = {
  title: 'todays-keywords/Keyword',
  component: Keyword,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const First: Story = {
  args: {
    idx: 0,
    keyword: '첫번째 키워드',
  },
};

export const Second: Story = {
  args: {
    idx: 1,
    keyword: '두번째 키워드',
  },
};

export const Third: Story = {
  args: {
    idx: 2,
    keyword: '세번째 키워드',
  },
};

export const Fourth: Story = {
  args: {
    idx: 3,
    keyword: '네번째 키워드',
  },
};
