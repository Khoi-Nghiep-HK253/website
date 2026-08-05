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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [deleteTarget, setDeleteTarget] = useState<ExpenseSummaryResponse | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteExpense(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          {t('groupDetail.tabExpenses')} ({expenses.length})
        </Typography>
        <Button
          size="medium"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onOpenCreateModal}
          sx={{
            whiteSpace: 'nowrap',
            width: { xs: '100%', sm: 'auto' },
            px: 2.5,
            py: 0.8,
            borderRadius: 2.5,
            fontWeight: 700,
          }}
        >
          {t('groupDetail.addExpenseBtn')}
        </Button>
      </Box>

      {expenses.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
          <ReceiptLongIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
          <Typography variant="body1">{t('groups.noExpenses', { defaultValue: 'Chưa có khoản chi nào trong nhóm này.' })}</Typography>
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
                  pr: { xs: 7, sm: 8 },
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => onSelectExpense(exp.id)}
                secondaryAction={
                  <Tooltip title={t('common.delete')}>
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
                      {exp.expenseDate || ''} • {t('groups.createdBy')}: {exp.createdByName || '—'}
                    </Typography>
                  }
                />
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', ml: 2, whiteSpace: 'nowrap' }}>
                  {exp.totalAmount ? exp.totalAmount.toLocaleString() : 0} {exp.currencyCode || 'VND'}
                </Typography>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="error" />
          {t('common.confirm')} {t('common.delete')}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {t('groups.deleteConfirmMsg', { defaultValue: 'Bạn có chắc chắn muốn xóa khoản chi này?' })} "{deleteTarget?.description}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
