import type { Meta, StoryObj } from '@storybook/react';
import MenuItem from './MenuItem';

const meta: Meta = {
  title: 'components/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: '/googleIcon.svg',
    title: 'Google',
    endpoint: 'https://www.google.com',
  },
};
