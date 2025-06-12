import type { Meta, StoryObj } from '@storybook/react-vite';
import LoginPage from './LoginPage';

const meta: Meta = {
  title: 'login/Login',
  component: LoginPage,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
