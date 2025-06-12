import type { Meta, StoryObj } from '@storybook/react-vite';
import DefaultLayout from './DefaultLayout';

const meta: Meta = {
  title: 'layouts/DefaultLayout',
  component: DefaultLayout,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
