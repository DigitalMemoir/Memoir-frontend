import type { Meta, StoryObj } from '@storybook/react-vite';
import Popup from './Popup';

const meta: Meta = {
  title: 'daily-summary/Popup',
  component: Popup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className={'w-full h-full bg-black dark:bg-black'}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const TopLeft: Story = {
  args: {
    dateString: '2025-06-29',
    tailYPosition: 'top',
    tailXPosition: 'left',
  },
};

export const TopRight: Story = {
  args: {
    dateString: '2025-06-29',
    tailYPosition: 'top',
    tailXPosition: 'right',
  },
};

export const BottomLeft: Story = {
  args: {
    dateString: '2025-06-29',
    tailYPosition: 'bottom',
    tailXPosition: 'left',
  },
};

export const BottomRight: Story = {
  args: {
    dateString: '2025-06-29',
    tailYPosition: 'bottom',
    tailXPosition: 'right',
  },
};
