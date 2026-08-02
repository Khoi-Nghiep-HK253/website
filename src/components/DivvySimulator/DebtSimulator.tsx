import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CalculateIcon from '@mui/icons-material/Calculate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  paid: number;
  share: number;
}

export interface CalculatedDebt {
  id: string;
  fromName: string;
  toName: string;
  amount: number;
  status: 'PENDING' | 'SETTLED';
}

export interface DebtSimulatorProps {
  initialDescription?: string;
  initialTotalAmount?: number;
  initialMembers?: Member[];
}

export const DebtSimulator: React.FC<DebtSimulatorProps> = ({
  initialDescription = 'Ăn lẩu thái cùng nhóm',
  initialTotalAmount = 1000000,
  initialMembers = [
    { id: '1', name: 'Bạn A (Ứng chính)', avatarColor: '#10b981', paid: 800000, share: 250000 },
    { id: '2', name: 'Bạn B (Góp thêm)', avatarColor: '#6366f1', paid: 200000, share: 250000 },
    { id: '3', name: 'Bạn C', avatarColor: '#f59e0b', paid: 0, share: 250000 },
    { id: '4', name: 'Bạn D', avatarColor: '#ec4899', paid: 0, share: 250000 },
  ],
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [totalAmount, setTotalAmount] = useState<number>(initialTotalAmount);
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const calculateInitialDebts = (mList: Member[], total: number): CalculatedDebt[] => {
    const shareEach = total / (mList.length || 1);
    const balances = mList.map((m) => ({
      ...m,
      share: shareEach,
      net: m.paid - shareEach,
    }));

    const debtors = balances.filter((b) => b.net < 0).map((b) => ({ ...b, net: Math.abs(b.net) }));
    const creditors = balances.filter((b) => b.net > 0).map((b) => ({ ...b, net: b.net }));

    const result: CalculatedDebt[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const transferAmount = Math.min(debtor.net, creditor.net);

      if (transferAmount > 0) {
        result.push({
          id: `d_${dIdx}_${cIdx}`,
          fromName: debtor.name,
          toName: creditor.name,
          amount: transferAmount,
          status: 'PENDING',
        });
      }

      debtor.net -= transferAmount;
      creditor.net -= transferAmount;

      if (debtor.net <= 0.01) dIdx++;
      if (creditor.net <= 0.01) cIdx++;
    }

    return result;
  };

  const [debts, setDebts] = useState<CalculatedDebt[]>(() =>
    calculateInitialDebts(initialMembers, initialTotalAmount)
  );

  const handleUpdatePaid = (id: string, newPaid: number) => {
    const updated = members.map((m) => (m.id === id ? { ...m, paid: newPaid } : m));
    setMembers(updated);
    recalculate(updated, totalAmount);
  };

  const handleTotalChange = (val: number) => {
    setTotalAmount(val);
    const equalShare = val / (members.length || 1);
    const updated = members.map((m) => ({ ...m, share: equalShare }));
    setMembers(updated);
    recalculate(updated, val);
  };

  const recalculate = (currentMembers: Member[], total: number) => {
    const newDebts = calculateInitialDebts(currentMembers, total);
    setDebts(newDebts);
  };

  const handleSettle = (debtId: string) => {
    setDebts(debts.map((d) => (d.id === debtId ? { ...d, status: 'SETTLED' } : d)));
  };

  const getAvatarInitial = (name: string): string => {
    const clean = name.trim();
    if (!clean) return 'M';
    const parts = clean.split(' ');
    const firstWord = parts[0] || '';
    if (firstWord.length > 0) return firstWord.charAt(0).toUpperCase();
    return clean.charAt(0).toUpperCase();
  };

  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: 4,
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
          <CalculateIcon sx={{ fontSize: 26 }} />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Mô Phỏng Bộ Tính Công Nợ Tự Động Divvy
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thử thay đổi thông tin khoản chi để xem thuật toán Divvy tự động cấn trừ "Ai nợ Ai"!
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Left Column: Expense Input & Payers */}
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ReceiptLongIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              1. Thông tin Khoản chi
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Mô tả khoản chi"
              size="small"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              label="Tổng tiền hóa đơn (VNĐ)"
              type="number"
              size="small"
              fullWidth
              value={totalAmount}
              onChange={(e) => handleTotalChange(Number(e.target.value))}
            />

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Người đứng ra thanh toán (Expense Payers):
            </Typography>

            {members.map((member) => {
              const net = member.paid - member.share;
              return (
                <Box
                  key={member.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    gap: 2,
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: member.avatarColor, width: 32, height: 32, fontSize: '0.85rem' }}>
                      {getAvatarInitial(member.name)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      type="number"
                      label="Ứng trước"
                      value={member.paid}
                      onChange={(e) => handleUpdatePaid(member.id, Number(e.target.value))}
                      sx={{ width: 130 }}
                    />
                    <Chip
                      label={net >= 0 ? `+${net.toLocaleString()}đ` : `${net.toLocaleString()}đ`}
                      color={net > 0 ? 'success' : net < 0 ? 'error' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Right Column: Calculated Debts & Settlement */}
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 3,
            height: '100%',
            bgcolor: 'action.hover',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                2. Kết quả Công nợ (Debts)
              </Typography>
            </Box>
            <Chip label={`${debts.length} khoản nợ cần xử lý`} color="secondary" size="small" />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hệ thống tự động tính toán đối trừ phần ứng tiền và phần tiền phải chịu (
            <strong>{(totalAmount / (members.length || 1)).toLocaleString()}đ/người</strong>):
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
            {debts.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2">Tất cả thành viên đã hòa tiền! Không có công nợ.</Typography>
              </Box>
            ) : (
              debts.map((debt) => (
                <Paper
                  key={debt.id}
                  elevation={1}
                  sx={{
                    p: 1.8,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    borderLeft: 4,
                    borderColor: debt.status === 'SETTLED' ? 'success.main' : 'warning.main',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {debt.fromName}
                    </Typography>
                    <ArrowForwardIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {debt.toName}
                    </Typography>
                    <Typography variant="subtitle2" color="error.main" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {debt.amount.toLocaleString('vi-VN')} đ
                    </Typography>
                  </Box>

                  {debt.status === 'SETTLED' ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Đã tất toán"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleSettle(debt.id)}
                      sx={{ fontSize: '0.75rem', borderRadius: 2 }}
                    >
                      Trả nợ (Settle)
                    </Button>
                  )}
                </Paper>
              ))
            )}
          </Box>

          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              💡 Divvy tối ưu thuật toán giảm thiểu tối đa số giao dịch cần chuyển tiền giữa các thành viên.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Card>
  );
};
