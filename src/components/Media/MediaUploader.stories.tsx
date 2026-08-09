import type { Meta, StoryObj } from '@storybook/react';
import { MediaUploader } from './MediaUploader';

const meta: Meta<typeof MediaUploader> = {
  title: 'Components/Media/MediaUploader',
  component: MediaUploader,
  tags: ['autodocs'],
  argTypes: {
    isUploading: { control: 'boolean' },
    error: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof MediaUploader>;

export const Default: Story = {
  args: {
    label: 'Tải Lên Hóa Đơn / Biên Lai Chi Tiêu',
    isUploading: false,
    error: null,
    onUpload: (file) => alert(`Selected file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`),
  },
};

export const Uploading: Story = {
  args: {
    label: 'Tải Lên Hóa Đơn / Biên Lai Chi Tiêu',
    isUploading: true,
    error: null,
  },
};

export const WithError: Story = {
  args: {
    label: 'Tải Lên Hóa Đơn / Biên Lai Chi Tiêu',
    isUploading: false,
    error: 'Kích thước tệp quá lớn (Tối đa 10MB). Vui lòng chọn tệp nhỏ hơn.',
  },
};

export const BankTransferProof: Story = {
  args: {
    label: 'Ảnh Chụp Màn Hình Chuyển Khoản Ngân Hàng',
    isUploading: false,
    error: null,
    onUpload: (file) => alert(`Selected file: ${file.name}`),
  },
};
