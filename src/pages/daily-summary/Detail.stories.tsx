import type { Meta, StoryObj } from '@storybook/react-vite';
import Detail from './Detail';

const meta: Meta = {
  title: 'daily-summary/Detail',
  component: Detail,
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
