import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/routes';
import type { ExpenseResponse } from '@/services/expenseService';

interface TopExpensesListProps {
  topExpenses: ExpenseResponse[];
}

export const TopExpensesList: React.FC<TopExpensesListProps> = React.memo(({ topExpenses }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigateGroup = useCallback(
    (groupId: number) => {
      navigate(PATHS.GROUPS.DETAIL(groupId));
    },
    [navigate]
  );

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ReceiptLongIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {t('dashboard.topExpensesTitle')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {topExpenses?.map((exp) => (
          <Paper
            key={exp.id}
            elevation={0}
            sx={{
              p: 1.8,
              borderRadius: 2,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {exp.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {exp.expenseDate}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 'bold' }}>
                {exp.totalAmount.toLocaleString('vi-VN')} đ
              </Typography>
              {exp.groupId && (
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => handleNavigateGroup(exp.groupId!)}
                  sx={{ fontSize: '0.75rem', p: 0 }}
                >
                  {t('dashboard.viewGroup')}
                </Button>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
});

TopExpensesList.displayName = 'TopExpensesList';

