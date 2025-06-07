import type { Meta, StoryObj } from "@storybook/react-vite";
import KeywordList from "./KeywordList";

const meta: Meta = {
  title: "onboarding/KeywordList",
  component: KeywordList,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // Add your default args here
  },
};
