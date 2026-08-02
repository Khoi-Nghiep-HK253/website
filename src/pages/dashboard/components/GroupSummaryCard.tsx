import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import GroupIcon from '@mui/icons-material/Group';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

export function GroupSummaryCard() {
  const groups = [
    {
      id: 'g1',
      name: 'Du lịch Vũng Tàu 2026',
      type: 'Du lịch',
      membersCount: 4,
      totalSpent: '4.500.000 đ',
      currency: 'VND',
      icon: <FlightTakeoffIcon />,
      color: '#10b981',
    },
    {
      id: 'g2',
      name: 'Nhóm Nhà Trọ Tháng 7',
      type: 'Sinh hoạt',
      membersCount: 3,
      totalSpent: '6.200.000 đ',
      currency: 'VND',
      icon: <HomeWorkIcon />,
      color: '#6366f1',
    },
    {
      id: 'g3',
      name: 'CLB Đá Bóng Cuối Tuần',
      type: 'Thể thao',
      membersCount: 8,
      totalSpent: '1.800.000 đ',
      currency: 'VND',
      icon: <SportsSoccerIcon />,
      color: '#f59e0b',
    },
  ];

  return (
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Danh Sách Nhóm Chi Tiêu (Divvy Groups)
          </Typography>
        </Box>
        <Chip label={`${groups.length} Nhóm đang hoạt động`} color="primary" size="small" />
      </Box>

      <List disablePadding>
        {groups.map((group, idx) => (
          <React.Fragment key={group.id}>
            {idx > 0 && <Divider component="li" />}
            <ListItem sx={{ py: 1.5, px: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: group.color }}>{group.icon}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {group.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Loại: {group.type} • {group.membersCount} thành viên
                  </Typography>
                }
              />
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                  {group.totalSpent}
                </Typography>
                <Chip label="Đang hoạt động" size="small" variant="outlined" color="success" />
              </Box>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}
