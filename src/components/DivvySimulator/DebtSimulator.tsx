import React, { useState, useMemo, useCallback } from 'react';
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
import { useTranslation } from 'react-i18next';

import type { Member, CalculatedDebt, DebtSimulatorProps } from './DebtSimulator.types';

/**
 * Pure algorithm for debt calculation & netting
 */
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

const getAvatarInitial = (name: string): string => {
  const clean = name.trim();
  if (!clean) return 'M';
  const parts = clean.split(' ');
  const firstWord = parts[0] || '';
  if (firstWord.length > 0) return firstWord.charAt(0).toUpperCase();
  return clean.charAt(0).toUpperCase();
};

export const DebtSimulator: React.FC<DebtSimulatorProps> = ({
  initialDescription,
  initialTotalAmount = 1000000,
  initialMembers,
}) => {
  const { t } = useTranslation();

  const defaultDesc = useMemo(
    () => initialDescription || t('debtSimulator.defaultDescription'),
    [initialDescription, t]
  );

  const defaultMembers = useMemo(() => {
    if (initialMembers) return initialMembers;
    return [
      { id: '1', name: t('debtSimulator.defaultMemberA'), avatarColor: '#10b981', paid: 800000, share: 250000 },
      { id: '2', name: t('debtSimulator.defaultMemberB'), avatarColor: '#6366f1', paid: 200000, share: 250000 },
      { id: '3', name: t('debtSimulator.defaultMemberC'), avatarColor: '#f59e0b', paid: 0, share: 250000 },
      { id: '4', name: t('debtSimulator.defaultMemberD'), avatarColor: '#ec4899', paid: 0, share: 250000 },
    ];
  }, [initialMembers, t]);

  const [description, setDescription] = useState(defaultDesc);
  const [totalAmount, setTotalAmount] = useState<number>(initialTotalAmount);
  const [members, setMembers] = useState<Member[]>(defaultMembers);

  const [debts, setDebts] = useState<CalculatedDebt[]>(() =>
    calculateInitialDebts(defaultMembers, initialTotalAmount)
  );

  const sharePerMember = useMemo(() => {
    return totalAmount / (members.length || 1);
  }, [totalAmount, members.length]);

  const handleUpdatePaid = useCallback(
    (id: string, newPaid: number) => {
      setMembers((prevMembers) => {
        const updated = prevMembers.map((m) => (m.id === id ? { ...m, paid: newPaid } : m));
        setDebts(calculateInitialDebts(updated, totalAmount));
        return updated;
      });
    },
    [totalAmount]
  );

  const handleTotalChange = useCallback(
    (val: number) => {
      setTotalAmount(val);
      setMembers((prevMembers) => {
        const equalShare = val / (prevMembers.length || 1);
        const updated = prevMembers.map((m) => ({ ...m, share: equalShare }));
        setDebts(calculateInitialDebts(updated, val));
        return updated;
      });
    },
    []
  );

  const handleSettle = useCallback((debtId: string) => {
    setDebts((prevDebts) =>
      prevDebts.map((d) => (d.id === debtId ? { ...d, status: 'SETTLED' } : d))
    );
  }, []);

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
            {t('debtSimulator.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('debtSimulator.subtitle')}
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
              {t('debtSimulator.section1Title')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('debtSimulator.descLabel')}
              size="small"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              label={t('debtSimulator.totalLabel')}
              type="number"
              size="small"
              fullWidth
              value={totalAmount}
              onChange={(e) => handleTotalChange(Number(e.target.value))}
            />

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              {t('debtSimulator.payersTitle')}
            </Typography>

            {members.map((member) => {
              const net = member.paid - member.share;
              return (
                <Box
                  key={member.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                      label={t('debtSimulator.paidLabel')}
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
                {t('debtSimulator.section2Title')}
              </Typography>
            </Box>
            <Chip label={t('debtSimulator.debtsCount', { count: debts.length })} color="secondary" size="small" />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('debtSimulator.nettingHint', { amount: sharePerMember.toLocaleString() })}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
            {debts.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2">{t('debtSimulator.allBalanced')}</Typography>
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
                    justifyContent: 'space-between',
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
                      label={t('debtSimulator.settledStatus')}
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
                      {t('debtSimulator.settleBtn')}
                    </Button>
                  )}
                </Paper>
              ))
            )}
          </Box>

          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {t('debtSimulator.footerTip')}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Card>
  );
};
