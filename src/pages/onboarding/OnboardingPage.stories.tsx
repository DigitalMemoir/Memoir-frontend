import type { Meta, StoryObj } from '@storybook/react-vite';
import OnboardingPage from './OnboardingPage';

const meta: Meta = {
  title: 'onboarding/OnboardingPage',
  component: OnboardingPage,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
