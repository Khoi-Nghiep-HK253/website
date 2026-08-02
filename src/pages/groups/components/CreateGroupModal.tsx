import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import type { CategoryResponse } from '@/services/categoryService';
import { Alert } from '@/components';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryResponse[];
  onSubmit: (data: {
    name: string;
    categoryId?: number;
    note?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  isPending: boolean;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  open,
  onClose,
  categories,
  onSubmit,
  isPending,
}) => {
  const [formName, setFormName] = useState('');
  const [formNote, setFormNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Vui lòng nhập tên nhóm.');
      return;
    }

    onSubmit({
      name: formName.trim(),
      categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
      note: formNote.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Tạo Nhóm Chi Tiêu Mới</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {formError && <Alert intent="error">{formError}</Alert>}

          <TextField
            label="Tên Nhóm (VD: Du Lịch Vũng Tàu 2026)"
            variant="outlined"
            fullWidth
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Nhập tên nhóm..."
          />

          <TextField
            label="Danh Mục Nhóm"
            select
            fullWidth
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          >
            <MenuItem value="">-- Không chọn danh mục --</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Ngày bắt đầu"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              label="Ngày kết thúc"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>

          <TextField
            label="Ghi chú nhóm"
            multiline
            rows={2}
            fullWidth
            value={formNote}
            onChange={(e) => setFormNote(e.target.value)}
            placeholder="Mô tả mục đích nhóm..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <GroupAddIcon />}
          >
            {isPending ? 'Đang tạo...' : 'Tạo Nhóm'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
