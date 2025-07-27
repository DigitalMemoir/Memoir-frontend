import type { Meta, StoryObj } from '@storybook/react';
import MenuItem from './MenuItem';
import clockIcon from '../assets/icons/clock.png';

const meta: Meta = {
  title: 'components/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: {
    icon: clockIcon,
    title: '사용시간 분포',
    endpoint: '#',
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    icon: clockIcon,
    title: '사용시간 분포',
    endpoint: '#',
    selected: true,
  },
};
