import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentsIcon from '@mui/icons-material/Payments';
import type { SettlementSummaryResponse } from '@/services/settlementService';
import type { DebtUserInfo } from '@/services/debtService';

interface SettlementsTabContentProps {
  settlements: SettlementSummaryResponse[];
}

const getUserDisplayName = (u?: DebtUserInfo, fallbackId?: number, fallbackName?: string): string => {
  if (u?.username) return u.username;
  if (u?.fullname) return u.fullname;
  if (fallbackName) return fallbackName;
  if (fallbackId) return `User #${fallbackId}`;
  return 'Thành viên';
};

export const SettlementsTabContent: React.FC<SettlementsTabContentProps> = ({ settlements }) => {
  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Lịch Sử Thanh Toán & Trả Nợ ({settlements.length})
      </Typography>

      {settlements.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
          <PaymentsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
          <Typography variant="body1">Chưa có giao dịch tất toán nợ nào được ghi nhận.</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {settlements.map((st, idx) => {
            const fromName = getUserDisplayName(st.fromUser, st.fromUserId, st.fromUsername);
            const toName = getUserDisplayName(st.toUser, st.toUserId, st.toUsername);

            return (
              <React.Fragment key={st.id}>
                {idx > 0 && <Divider component="li" />}
                <ListItem sx={{ py: 1.8 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {fromName} đã tất toán cho {toName}
                      </Typography>
                    }
                    secondary={`Phương thức: ${st.method || 'TIỀN MẶT'} • Ghi chú: ${st.note || 'Không có'}`}
                  />
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                    +{st.amount.toLocaleString('vi-VN')} đ
                  </Typography>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};
