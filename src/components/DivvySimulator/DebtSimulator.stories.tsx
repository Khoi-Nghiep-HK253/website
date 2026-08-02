import type { Meta, StoryObj } from '@storybook/react';
import { DebtSimulator } from './DebtSimulator';

const meta: Meta<typeof DebtSimulator> = {
  title: 'Components/DivvySimulator/DebtSimulator',
  component: DebtSimulator,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DebtSimulator>;

export const Default: Story = {
  args: {
    initialDescription: 'Ăn lẩu thái cùng nhóm',
    initialTotalAmount: 1000000,
  },
};

export const CustomTripExpense: Story = {
  args: {
    initialDescription: 'Khách sạn Đà Lạt 3 ngày 2 đêm',
    initialTotalAmount: 2400000,
    initialMembers: [
      { id: '1', name: 'Minh (Trưởng đoàn)', avatarColor: '#059669', paid: 2400000, share: 600000 },
      { id: '2', name: 'Hoàng', avatarColor: '#6366f1', paid: 0, share: 600000 },
      { id: '3', name: 'Trang', avatarColor: '#ec4899', paid: 0, share: 600000 },
      { id: '4', name: 'Nam', avatarColor: '#f59e0b', paid: 0, share: 600000 },
    ],
  },
};

export const MultiplePayers: Story = {
  args: {
    initialDescription: 'Tiệc BBQ ngoài trời',
    initialTotalAmount: 1500000,
    initialMembers: [
      { id: '1', name: 'An (Mua thịt)', avatarColor: '#10b981', paid: 900000, share: 500000 },
      { id: '2', name: 'Bình (Mua bia)', avatarColor: '#6366f1', paid: 600000, share: 500000 },
      { id: '3', name: 'Chi', avatarColor: '#f59e0b', paid: 0, share: 500000 },
    ],
  },
};
