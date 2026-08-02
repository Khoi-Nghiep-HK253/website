import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    intent: 'info',
    children: 'Đây là thông tin hướng dẫn dành cho người dùng hệ thống.',
  },
};

export const Success: Story = {
  args: {
    intent: 'success',
    title: 'Thao tác thành công',
    children: 'Dữ liệu tài khoản của bạn đã được cập nhật thành công.',
  },
};

export const Warning: Story = {
  args: {
    intent: 'warning',
    title: 'Cảnh báo hệ thống',
    children: 'Phiên đăng nhập của bạn sắp hết hạn trong 5 phút tới.',
  },
};

export const ErrorAlert: Story = {
  args: {
    intent: 'error',
    title: 'Xảy ra lỗi',
    children: 'Mật khẩu xác nhận không khớp với mật khẩu vừa đặt.',
  },
};

export const Dismissible: Story = {
  args: {
    intent: 'info',
    title: 'Cập nhật hệ thống',
    children: 'Hệ thống vừa bổ sung tính năng mới.',
    onDismiss: () => alert('Alert dismissed!'),
  },
};
