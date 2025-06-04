import type { Meta, StoryObj } from '@storybook/react';
import KeywordButton from './KeywordButton';

const meta: Meta = {
  title: 'onboarding/KeywordButton',
  component: KeywordButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: '✏',
    keyword: '공부, 학습',
    onClick: () => alert('Primary Keyword Clicked!'),
  },
};
