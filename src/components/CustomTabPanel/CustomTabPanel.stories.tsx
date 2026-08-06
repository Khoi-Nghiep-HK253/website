import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { CustomTabPanel } from './CustomTabPanel';

const meta: Meta<typeof CustomTabPanel> = {
  title: 'Components/CustomTabPanel',
  component: CustomTabPanel,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'number' },
    index: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof CustomTabPanel>;

export const Active: Story = {
  args: {
    value: 0,
    index: 0,
    children: (
      <Typography variant="body1" color="text.primary">
        Đây là nội dung của Tab 1 (Active State).
      </Typography>
    ),
  },
};

export const Inactive: Story = {
  args: {
    value: 1,
    index: 0,
    children: (
      <Typography variant="body1" color="text.primary">
        Đây là nội dung của Tab 1 nhưng đang ở trạng thái ẩn (Hidden).
      </Typography>
    ),
  },
};

const InteractiveTabsDemo = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ width: 400, border: '1px solid #e2e8f0', borderRadius: 3, p: 2 }}>
      <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} color="primary">
        <Tab label="Tab Đầu Tiên" />
        <Tab label="Tab Thứ Hai" />
        <Tab label="Tab Thứ Ba" />
      </Tabs>

      <CustomTabPanel value={tabIndex} index={0}>
        <Typography variant="body1">Nội dung chi tiết cho Tab Đầu Tiên.</Typography>
      </CustomTabPanel>

      <CustomTabPanel value={tabIndex} index={1}>
        <Typography variant="body1">Nội dung chi tiết cho Tab Thứ Hai.</Typography>
      </CustomTabPanel>

      <CustomTabPanel value={tabIndex} index={2}>
        <Typography variant="body1">Nội dung chi tiết cho Tab Thứ Ba.</Typography>
      </CustomTabPanel>
    </Box>
  );
};

export const InteractiveTabs: Story = {
  render: () => <InteractiveTabsDemo />,
};
