import type { Meta, StoryObj } from '@storybook/react-vite';
import ToastMessage from './ToastMessage';
import toast from 'react-hot-toast';

const meta: Meta = {
  title: 'components/ToastMessage',
  component: ToastMessage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // 배경 어둡게
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#333' },
        { name: 'light', value: '#fff' },
      ],
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className="bg-white">
          <button
            onClick={() =>
              toast.error(
                (t) => (
                  <ToastMessage onDismiss={() => toast.dismiss(t.id)}>
                    토스트 예시
                  </ToastMessage>
                ),
                {
                  position: 'top-right',
                  duration: 300000,
                  style: {
                    width: 'fit-content',
                    height: 'fit-content',
                    margin: '0',
                    boxShadow: 'none',
                    maxWidth: '352px',
                    backgroundColor: 'transparent',
                  },
                  icon: null,
                }
              )
            }
          >
            토스트 띄우기
          </button>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onDismiss: () => {},
    children: '토스트 메시지 예시',
  },
};
