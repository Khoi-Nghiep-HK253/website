import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LanguageSwitcher } from './LanguageSwitcher';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Components/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const Default: Story = {
  render: () => (
    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #e2e8f0', borderRadius: 3 }}>
      <Typography variant="body2" color="text.secondary">
        Chọn ngôn ngữ giao diện:
      </Typography>
      <LanguageSwitcher />
    </Box>
  ),
};
