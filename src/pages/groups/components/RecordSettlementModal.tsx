import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import type { CreateSettlementPayload } from '@/services/settlementService';
import { Alert } from '@/components';

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
  const [settleAmount, setSettleAmount] = useState<number>(defaultAmount);
  const [settleMethod, setSettleMethod] = useState<'CASH' | 'BANK_TRANSFER'>('CASH');
  const [settleNote, setSettleNote] = useState('');
  const [settleError, setSettleError] = useState<string | null>(null);

  useEffect(() => {
    setSettleAmount(defaultAmount);
  }, [defaultAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettleError(null);

    if (!debtId || settleAmount <= 0) {
      setSettleError('Số tiền tất toán không hợp lệ.');
      return;
    }

    onSubmit({
      debtId,
      amount: Number(settleAmount),
      method: settleMethod,
      note: settleNote.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Ghi Nhận Trả Nợ / Tất Toán</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {settleError && <Alert intent="error">{settleError}</Alert>}

          <TextField
            label="Số tiền tất toán (VNĐ)"
            type="number"
            variant="outlined"
            fullWidth
            required
            value={settleAmount}
            onChange={(e) => setSettleAmount(Number(e.target.value))}
          />

          <TextField
            label="Phương thức thanh toán"
            select
            fullWidth
            value={settleMethod}
            onChange={(e) => setSettleMethod(e.target.value as 'CASH' | 'BANK_TRANSFER')}
          >
            <MenuItem value="CASH">Tiền mặt (CASH)</MenuItem>
            <MenuItem value="BANK_TRANSFER">Chuyển khoản (BANK_TRANSFER)</MenuItem>
          </TextField>

          <TextField
            label="Ghi chú tất toán"
            variant="outlined"
            fullWidth
            value={settleNote}
            onChange={(e) => setSettleNote(e.target.value)}
            placeholder="Nhập ghi chú (VD: Đã chuyển khoản Vietcombank)..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="success" disabled={isPending}>
            {isPending ? <CircularProgress size={20} color="inherit" /> : 'Xác Nhận Tất Toán'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
