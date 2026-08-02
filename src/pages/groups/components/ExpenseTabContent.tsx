import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { ExpenseSummaryResponse } from '@/services/expenseService';

interface ExpenseTabContentProps {
  expenses: ExpenseSummaryResponse[];
  onOpenCreateModal: () => void;
  onSelectExpense: (expenseId: number) => void;
  onDeleteExpense: (expenseId: number) => void;
}

export const ExpenseTabContent: React.FC<ExpenseTabContentProps> = ({
  expenses,
  onOpenCreateModal,
  onSelectExpense,
  onDeleteExpense,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<ExpenseSummaryResponse | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteExpense(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Danh Sách Khoản Chi Nhóm ({expenses.length})
        </Typography>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={onOpenCreateModal}>
          Tạo Khoản Chi
        </Button>
      </Box>

      {expenses.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
          <ReceiptLongIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
          <Typography variant="body1">Chưa có khoản chi nào trong nhóm này.</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {expenses.map((exp, idx) => (
            <React.Fragment key={exp.id}>
              {idx > 0 && <Divider component="li" />}
              <ListItem
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => onSelectExpense(exp.id)}
                secondaryAction={
                  <Tooltip title="Xóa khoản chi">
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(exp);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <ReceiptLongIcon color="primary" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {exp.description}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Người tạo: {exp.createdByName || 'Thành viên'} • Ngày: {exp.expenseDate || exp.createdAt || 'Mới'} • Loại: {exp.splitType || 'EQUAL'}
                    </Typography>
                  }
                />
                <Box sx={{ mr: 4, textAlign: 'right' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {exp.totalAmount.toLocaleString('vi-VN')} {exp.currency?.acronym || exp.currency?.code || exp.currencyCode || 'VNĐ'}
                  </Typography>
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <WarningAmberIcon color="error" />
          Xác Nhận Xóa Khoản Chi
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ pt: 1 }}>
            Bạn có chắc chắn muốn xóa khoản chi <strong>"{deleteTarget?.description}"</strong>?
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Các công nợ phát sinh từ khoản chi này cũng sẽ bị xóa. Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit">
            Hủy
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Xóa Khoản Chi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
