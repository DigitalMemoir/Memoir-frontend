import type { Meta, StoryObj } from '@storybook/react-vite';
import Keywords from './Keywords';

const meta: Meta = {
  title: 'daily-summary/Keywords',
  component: Keywords,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    date: '1',
    keywords: [
      { keyword: 'React', frequency: 5 },
      { keyword: 'Storybook', frequency: 3 },
      { keyword: 'JavaScript', frequency: 4 },
      { keyword: 'CSS', frequency: 2 },
      { keyword: 'Testing', frequency: 1 },
    ],
  },
};
