import type { Meta, StoryObj } from '@storybook/react-vite';
import AddBookmark from './AddBookmark';

const meta: Meta = {
  title: 'new-tab/AddBookmark',
  component: AddBookmark,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
