import type { Meta, StoryObj } from '@storybook/react-vite';
import Popup from './Popup';

const meta: Meta = {
  title: 'daily-summary/Popup',
  component: Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    dateString: '2025-06-29',
  },
};
