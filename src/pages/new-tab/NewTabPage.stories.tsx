import type { Meta, StoryObj } from '@storybook/react-vite';
import NewTabPage from './NewTabPage';

const meta: Meta = {
  title: 'new-tab/NewTabPage',
  component: NewTabPage,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
