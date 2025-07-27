import type { Meta, StoryObj } from '@storybook/react-vite';
import TodaysKeywordsPage from './TodaysKeywordsPage';

const meta: Meta = {
  title: 'todays-keywords/TodaysKeywordsPage',
  component: TodaysKeywordsPage,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
