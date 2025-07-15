import type { Meta, StoryObj } from '@storybook/react-vite';
import Statistics from './Statistics';

const meta: Meta = {
  title: 'usage/Statistics',
  component: Statistics,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
