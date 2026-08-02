import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export function ActivityLogCard() {
  const logs = [
    {
      id: 'a1',
      action: 'Thành viên Bạn A đã tạo khoản chi "Ăn lẩu thái"',
      amount: '1.000.000 đ',
      time: '10 phút trước',
      type: 'EXPENSE',
      icon: <ReceiptLongIcon color="primary" fontSize="small" />,
    },
    {
      id: 'a2',
      action: 'Thành viên Bạn C đã hoàn tất tất toán khoản nợ 250.000đ cho Bạn A',
      amount: '250.000 đ',
      time: '25 phút trước',
      type: 'SETTLEMENT',
      icon: <CheckCircleIcon color="success" fontSize="small" />,
    },
    {
      id: 'a3',
      action: 'Thành viên Bạn D đã tham gia nhóm qua lời mời Token',
      amount: '',
      time: '1 giờ trước',
      type: 'INVITATION',
      icon: <PersonAddIcon color="info" fontSize="small" />,
    },
  ];

  return (
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="secondary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Nhật Ký Hoạt Động (Activity Logs)
          </Typography>
        </Box>
        <Chip label="Minh bạch 100%" color="secondary" size="small" variant="outlined" />
      </Box>

      <List disablePadding>
        {logs.map((log, idx) => (
          <React.Fragment key={log.id}>
            {idx > 0 && <Divider component="li" />}
            <ListItem sx={{ py: 1.2, px: 1 }}>
              <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>{log.icon}</Box>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {log.action}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Thời gian: {log.time}
                  </Typography>
                }
              />
              {log.amount && (
                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                  {log.amount}
                </Typography>
              )}
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}
