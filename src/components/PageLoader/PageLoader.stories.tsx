import type { Meta, StoryObj } from '@storybook/react';
import { PageLoader } from './PageLoader';

const meta: Meta<typeof PageLoader> = {
  title: 'Components/PageLoader',
  component: PageLoader,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof PageLoader>;

export const Default: Story = {
  args: {
    label: undefined,
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Đang đồng bộ dữ liệu hệ thống...',
  },
};
