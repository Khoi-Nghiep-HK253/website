import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import type { GroupResponse } from '@/services/groupService';
import type { CategoryResponse } from '@/services/categoryService';
import { useUpdateGroupMutation } from '@/hooks/query/useGroupQuery';
import { useToast } from '@/hooks/common/useToast';
import { Alert } from '@/components';

interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  group: GroupResponse;
  categories: CategoryResponse[];
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  open,
  onClose,
  group,
  categories,
}) => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const updateGroupMutation = useUpdateGroupMutation();

  const [formName, setFormName] = useState('');
  const [formNote, setFormNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Sync initial values when modal opens or group changes
  useEffect(() => {
    if (open && group) {
      setFormName(group.name || '');
      setFormNote(group.note || '');
      setSelectedCategoryId(group.categoryId || group.category?.id || '');
      setStartDate(group.startDate ? group.startDate.substring(0, 10) : '');
      setEndDate(group.endDate ? group.endDate.substring(0, 10) : '');
      setFormError(null);
    }
  }, [open, group]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!formName.trim()) {
        setFormError(t('editGroupModal.nameRequired'));
        return;
      }

      updateGroupMutation.mutate(
        {
          groupId: group.id,
          payload: {
            name: formName.trim(),
            note: formNote.trim() || undefined,
            categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        },
        {
          onSuccess: () => {
            showSuccess(t('editGroupModal.updateSuccess'));
            onClose();
          },
          onError: (err) => {
            setFormError(`${t('editGroupModal.updateFailed')} ${err.message || ''}`);
          },
        }
      );
    },
    [formName, selectedCategoryId, formNote, startDate, endDate, group.id, updateGroupMutation, showSuccess, onClose, t]
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => (
        <MenuItem key={cat.id} value={cat.id}>
          {cat.name}
        </MenuItem>
      )),
    [categories]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>{t('editGroupModal.title')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '20px !important' }}>
          {formError && <Alert intent="error">{formError}</Alert>}

          <TextField
            label={t('editGroupModal.nameLabel')}
            variant="outlined"
            fullWidth
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder={t('editGroupModal.namePlaceholder')}
          />

          <TextField
            label={t('editGroupModal.categoryLabel')}
            select
            fullWidth
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          >
            <MenuItem value="">{t('editGroupModal.noCategory')}</MenuItem>
            {categoryOptions}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('editGroupModal.startDate')}
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              label={t('editGroupModal.endDate')}
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>

          <TextField
            label={t('editGroupModal.noteLabel')}
            multiline
            rows={2}
            fullWidth
            value={formNote}
            onChange={(e) => setFormNote(e.target.value)}
            placeholder={t('editGroupModal.notePlaceholder')}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            {t('editGroupModal.cancel')}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={updateGroupMutation.isPending}
            startIcon={
              updateGroupMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
          >
            {updateGroupMutation.isPending
              ? t('editGroupModal.submitting')
              : t('editGroupModal.submit')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
