import React, { useState, useMemo, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
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
  onSubmit: (payload: CreateSettlementPayload, files?: File[]) => void | Promise<void>;
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

  // File Attachment State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const validFiles: File[] = [];
      const newUrls: string[] = [];

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          setSettleError(t('media.fileTooLarge'));
          return;
        }
        if (!file.type.startsWith('image/')) {
          setSettleError(t('media.invalidFileType'));
          return;
        }
        validFiles.push(file);
        newUrls.push(URL.createObjectURL(file));
      }

      setSettleError(null);
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    },
    [t]
  );

  const handleRemoveFile = useCallback((index: number) => {
    setPreviewUrls((prevUrls) => {
      const targetUrl = prevUrls[index];
      if (targetUrl) URL.revokeObjectURL(targetUrl);
      return prevUrls.filter((_, i) => i !== index);
    });
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevDefaultAmount, setPrevDefaultAmount] = useState(defaultAmount);

  if (open !== prevOpen || defaultAmount !== prevDefaultAmount) {
    setPrevOpen(open);
    setPrevDefaultAmount(defaultAmount);
    if (open) {
      setSettleAmount(defaultAmount);
      setSettleMethod(SETTLEMENT_METHOD_VALUE.CASH);
      setSettleNote('');
      setSelectedFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
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

      onSubmit(
        {
          debtId,
          amount: Number(settleAmount),
          method: settleMethod,
          note: settleNote.trim() || undefined,
        },
        selectedFiles
      );
    },
    [debtId, onSubmit, selectedFiles, settleAmount, settleMethod, settleNote, t]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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

          {/* Payment Proof / Receipt Attachment (Optional) */}
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.secondary' }}>
              {t('recordSettlementModal.sectionProofImage')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {t('recordSettlementModal.proofImageHint')}
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {previewUrls.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>
                  {previewUrls.map((url, idx) => {
                    const file = selectedFiles[idx];
                    return (
                      <Paper
                        key={idx}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderRadius: 3,
                          bgcolor: 'action.hover',
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1, overflow: 'hidden' }}>
                          <Box
                            component="img"
                            src={url}
                            alt={`Proof preview ${idx + 1}`}
                            sx={{ width: 48, height: 48, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                          />
                          <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'block',
                              }}
                            >
                              {file?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton onClick={() => handleRemoveFile(idx)} color="error" size="small" sx={{ flexShrink: 0, ml: 1 }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    );
                  })}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<AddPhotoAlternateIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ borderRadius: 2, textTransform: 'none', borderStyle: 'dashed' }}
                  >
                    + {t('recordSettlementModal.selectProofImage')}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ borderRadius: 2.5, textTransform: 'none', borderStyle: 'dashed', py: 1 }}
              >
                {t('recordSettlementModal.selectProofImage')}
              </Button>
            )}
          </Box>
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
