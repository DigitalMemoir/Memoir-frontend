import type { Meta, StoryObj } from '@storybook/react';
import Bookmark from './Bookmark';

const meta: Meta = {
  title: 'new-tab/Bookmark',
  component: Bookmark,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    href: 'https://www.google.com',
  },
};
