import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import type { CreateSettlementPayload } from '@/services/settlementService';
import { Alert } from '@/components';
import {
  SETTLEMENT_METHOD_VALUE,
  type SettlementMethod,
  getSettlementMethodsConfig,
} from '@/constants';

interface RecordSettlementModalProps {
  open: boolean;
  onClose: () => void;
  debtId: number | null;
  defaultAmount: number;
  onSubmit: (payload: CreateSettlementPayload) => void;
  isPending: boolean;
}

export const RecordSettlementModal: React.FC<RecordSettlementModalProps> = ({
  open,
  onClose,
  debtId,
  defaultAmount,
  onSubmit,
  isPending,
}) => {
  const { t } = useTranslation();
  const [settleAmount, setSettleAmount] = useState<number>(defaultAmount);
  const [settleMethod, setSettleMethod] = useState<SettlementMethod>(SETTLEMENT_METHOD_VALUE.CASH);
  const [settleNote, setSettleNote] = useState('');
  const [settleError, setSettleError] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevDefaultAmount, setPrevDefaultAmount] = useState(defaultAmount);

  if (open !== prevOpen || defaultAmount !== prevDefaultAmount) {
    setPrevOpen(open);
    setPrevDefaultAmount(defaultAmount);
    if (open) {
      setSettleAmount(defaultAmount);
      setSettleMethod(SETTLEMENT_METHOD_VALUE.CASH);
      setSettleNote('');
      setSettleError(null);
    }
  }

  // Memoized payment method options with i18n from constants
  const methodOptions = useMemo(() => getSettlementMethodsConfig(t), [t]);

  // Memoized submission handler with useCallback
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSettleError(null);

      if (!debtId || settleAmount <= 0) {
        setSettleError(t('recordSettlementModal.invalidAmount'));
        return;
      }

      onSubmit({
        debtId,
        amount: Number(settleAmount),
        method: settleMethod,
        note: settleNote.trim() || undefined,
      });
    },
    [debtId, onSubmit, settleAmount, settleMethod, settleNote, t]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
          {t('recordSettlementModal.title')}
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '20px !important' }}>
          {settleError && <Alert intent="error">{settleError}</Alert>}

          <TextField
            label={t('recordSettlementModal.amountLabel')}
            type="number"
            variant="outlined"
            fullWidth
            required
            value={settleAmount}
            onChange={(e) => setSettleAmount(Number(e.target.value))}
            slotProps={{ input: { inputProps: { min: 0 } } }}
          />

          <TextField
            label={t('recordSettlementModal.methodLabel')}
            select
            fullWidth
            value={settleMethod}
            onChange={(e) => setSettleMethod(e.target.value as SettlementMethod)}
          >
            {methodOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t('recordSettlementModal.noteLabel')}
            variant="outlined"
            fullWidth
            value={settleNote}
            onChange={(e) => setSettleNote(e.target.value)}
            placeholder={t('recordSettlementModal.notePlaceholder')}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            {t('recordSettlementModal.cancel')}
          </Button>
          <Button type="submit" variant="contained" color="success" disabled={isPending}>
            {isPending ? <CircularProgress size={20} color="inherit" /> : t('recordSettlementModal.submit')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
