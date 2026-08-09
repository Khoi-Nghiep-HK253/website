import type { Meta, StoryObj } from '@storybook/react';
import { MediaGallery } from './MediaGallery';
import type { MediaAttachmentResponse } from '@/services/mediaService';

const mockAttachments: MediaAttachmentResponse[] = [
  {
    id: 101,
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
    fileName: 'hoa_don_nha_hang_haisan.jpg',
    fileType: 'image/jpeg',
    fileSize: 1024500,
    entityType: 'EXPENSE',
    entityId: 42,
    uploadedBy: 'divvy_admin',
    createdAt: '2026-08-08T10:00:00Z',
  },
  {
    id: 102,
    fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=60',
    fileName: 'bill_khach_san_dalat.png',
    fileType: 'image/png',
    fileSize: 2048000,
    entityType: 'EXPENSE',
    entityId: 42,
    uploadedBy: 'quang_nam',
    createdAt: '2026-08-08T11:30:00Z',
  },
  {
    id: 103,
    fileUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60',
    fileName: 'chuyen_khoan_vcb_150k.jpg',
    fileType: 'image/jpeg',
    fileSize: 512000,
    entityType: 'SETTLEMENT',
    entityId: 15,
    uploadedBy: 'divvy_admin',
    createdAt: '2026-08-08T14:15:00Z',
  },
];

const meta: Meta<typeof MediaGallery> = {
  title: 'Components/Media/MediaGallery',
  component: MediaGallery,
  tags: ['autodocs'],
  argTypes: {
    isPending: { control: 'boolean' },
    isDeleting: { control: 'boolean' },
    currentUsername: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof MediaGallery>;

export const DefaultMultipleImages: Story = {
  args: {
    attachments: mockAttachments,
    isPending: false,
    currentUsername: 'divvy_admin',
    onDeleteAttachment: (id) => alert(`Requested deletion of attachment ID: ${id}`),
  },
};

export const SingleImage: Story = {
  args: {
    attachments: [mockAttachments[0]],
    isPending: false,
    currentUsername: 'divvy_admin',
    onDeleteAttachment: (id) => alert(`Requested deletion of attachment ID: ${id}`),
  },
};

export const EmptyState: Story = {
  args: {
    attachments: [],
    isPending: false,
  },
};

export const LoadingState: Story = {
  args: {
    attachments: [],
    isPending: true,
  },
};

export const ErrorState: Story = {
  args: {
    attachments: [],
    isPending: false,
    error: new Error('Không thể tải danh sách tệp đính kèm từ máy chủ.'),
  },
};
