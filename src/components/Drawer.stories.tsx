import type { Meta, StoryObj } from '@storybook/react-vite';
import Drawer from './Drawer';
import { useState } from 'react';

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

const ModalWithTrigger = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>모달 열기</button>
      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export const Primary: Story = {
  args: {
    isOpen: true,
  },
  render: () => {
    return <ModalWithTrigger />;
  },
};
