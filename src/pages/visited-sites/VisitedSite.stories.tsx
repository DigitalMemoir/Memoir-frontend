import type { Meta, StoryObj } from '@storybook/react-vite';
import VisitedSite from './VisitedSite';

const meta: Meta = {
  title: 'visited-sites/VisitedSite',
  component: VisitedSite,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    domain:
      'https://www.youtube.com/watch?v=sb27EfioKKw&list=PL9JEc2ojL0OU2yaD0I07xzMzE2A9QDP-I&index=21',
    title: 'YouTube - sb27EfioKKw',
  },
};
