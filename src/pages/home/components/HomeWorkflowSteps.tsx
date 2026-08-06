import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
}

interface HomeWorkflowStepsProps {
  steps: WorkflowStep[];
}

export const HomeWorkflowSteps: React.FC<HomeWorkflowStepsProps> = ({ steps }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Chip label={t('home.workflowBadge')} color="secondary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          {t('home.workflowTitle')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
          gap: 2,
        }}
      >
        {steps.map((item, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2.5, borderRadius: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h4" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
              {item.step}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.desc}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
