import type { Meta, StoryObj } from '@storybook/react-vite';
import Drawer from './Drawer';

const meta: Meta = {
  title: 'components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className={'flex items-center justify-center h-screen'}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    isOpen: true,
  },
};
