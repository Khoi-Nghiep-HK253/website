import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentsIcon from '@mui/icons-material/Payments';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useTranslation } from 'react-i18next';
import { useExpenseDetail } from '@/hooks/query/useExpenseQuery';
import { Alert } from '@/components';
import { MediaGalleryContainer, MediaUploaderContainer } from '@/containers';

interface ExpenseDetailModalProps {
  open: boolean;
  onClose: () => void;
  groupId: number;
  expenseId: number | null;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  open,
  onClose,
  groupId,
  expenseId,
}) => {
  const { t } = useTranslation();
  const { data: expense, isPending, error } = useExpenseDetail(groupId, expenseId);

  const currencySymbol =
    expense?.currency?.symbol || expense?.currency?.acronym || expense?.currency?.code || expense?.currencyCode || 'VND';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <ReceiptLongIcon />
        </Avatar>
        {t('groups.expenseDetailTitle')}
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
        {isPending ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Alert intent="error" title={t('common.error')}>
            {error.message}
          </Alert>
        ) : !expense ? (
          <Typography color="text.secondary">{t('groups.noExpenseFound')}</Typography>
        ) : (
          <>
            {/* Header info card */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'action.hover' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                {expense.description}
              </Typography>

              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                {(expense.totalAmount || 0).toLocaleString()} {currencySymbol}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<CalendarTodayIcon fontSize="small" />}
                  label={`${expense.expenseDate || expense.createdAt || ''}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<PieChartIcon fontSize="small" />}
                  label={`${expense.splitType || 'EQUAL'}`}
                  size="small"
                  color="secondary"
                />
                <Chip
                  icon={<PersonIcon fontSize="small" />}
                  label={`${t('groups.createdBy')}: ${expense.createdByName || '—'}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Paper>

            {/* Section 1: Người ứng tiền (Payers) */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentsIcon fontSize="small" />
                {t('groups.payers')} ({expense.payers?.length || 0})
              </Typography>

              <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <List disablePadding>
                  {(expense.payers || []).map((payer, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <Divider component="li" />}
                      <ListItem sx={{ py: 1.2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.light', width: 36, height: 36 }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {payer.username || `User #${payer.userId}`}
                            </Typography>
                          }
                          secondary={t('groups.paidBefore')}
                        />
                        <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 'bold' }}>
                          +{(payer.amount || 0).toLocaleString()} {currencySymbol}
                        </Typography>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>

            {/* Section 2: Người tham gia chia tiền (Shares) */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PieChartIcon fontSize="small" />
                {t('groups.shares')} ({expense.shares?.length || 0})
              </Typography>

              <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <List disablePadding>
                  {(expense.shares || []).map((share, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <Divider component="li" />}
                      <ListItem sx={{ py: 1.2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.light', width: 36, height: 36 }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {share.username || `User #${share.userId}`}
                            </Typography>
                          }
                          secondary={t('groups.owesShare')}
                        />
                        <Typography variant="subtitle1" color="error.main" sx={{ fontWeight: 'bold' }}>
                          -{(share.amount || 0).toLocaleString()} {currencySymbol}
                        </Typography>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>

            {/* Section 3: Media & Receipt Attachments */}
            <Box>
              <MediaGalleryContainer entityType="EXPENSE" entityId={expense.id} />
              <Box sx={{ mt: 2 }}>
                <MediaUploaderContainer entityType="EXPENSE" entityId={expense.id} />
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
