import type { Meta, StoryObj } from '@storybook/react-vite';
import TotalTimes from './TotalTimes';

const meta: Meta = {
  title: 'usage/TotalTimes',
  component: TotalTimes,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    category: '업무, 프로젝트',
    minutes: 30,
  },
};
