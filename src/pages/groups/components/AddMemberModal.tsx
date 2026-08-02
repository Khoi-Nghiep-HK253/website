import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert } from '@/components';

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: number) => void;
  isPending: boolean;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onClose,
  onSubmit,
  isPending,
}) => {
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [memberError, setMemberError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);

    const uid = Number(targetUserId);
    if (!uid || uid <= 0) {
      setMemberError('Vui lòng nhập ID người dùng hợp lệ.');
      return;
    }

    onSubmit(uid);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Mời Thành Viên Vào Nhóm</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {memberError && <Alert intent="error">{memberError}</Alert>}

          <TextField
            label="User ID Thành Viên"
            type="number"
            variant="outlined"
            fullWidth
            required
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="Nhập ID người dùng (VD: 2)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? <CircularProgress size={20} color="inherit" /> : 'Thêm Thành Viên'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
