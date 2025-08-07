import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from './Calendar';

const meta: Meta = {
  title: 'daily-summary/Calendar',
  component: Calendar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
