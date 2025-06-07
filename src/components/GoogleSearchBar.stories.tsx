import type { Meta, StoryObj } from '@storybook/react-vite';
import GoogleSearchBar from './GoogleSearchBar';

const meta: Meta = {
  title: 'new-tab/GoogleSearchBar',
  component: GoogleSearchBar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
