import React, { useState, useMemo, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { ExpenseSharePayload } from '@/services/expenseService';
import { Alert } from '@/components';
import { SPLIT_TYPE_VALUE, type SplitType, getSplitTypesConfig } from '@/constants';
import type { CreateExpenseModalProps, PayerEntry, ShareEntry } from './CreateExpenseModal.types';
import {
  getMemberUsername,
  getMemberDisplayName,
  getMemberUserId,
  previewShares,
} from './CreateExpenseModal.helpers';

export type * from './CreateExpenseModal.types';

// ── Component ────────────────────────────────────────────────────────────────
export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({
  open,
  onClose,
  currencies,
  members,
  currentUserId,
  onSubmit,
  isPending,
}) => {
  const { t } = useTranslation();

  // Dynamic split types definition with i18n from constants
  const splitTypes = useMemo(() => getSplitTypesConfig(t), [t]);

  // Basic info
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [currencyId, setCurrencyId] = useState<number>(currencies[0]?.id ?? 1);
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [splitType, setSplitType] = useState<SplitType>(SPLIT_TYPE_VALUE.EQUAL);

  // Payers
  const [payers, setPayers] = useState<PayerEntry[]>([]);

  // Shares
  const [shareEntries, setShareEntries] = useState<ShareEntry[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Multiple File Attachments
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
          setSubmitError(t('media.fileTooLarge'));
          return;
        }
        if (!file.type.startsWith('image/')) {
          setSubmitError(t('media.invalidFileType'));
          return;
        }
        validFiles.push(file);
        newUrls.push(URL.createObjectURL(file));
      }

      setSubmitError(null);
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

  if (open && !prevOpen) {
    setPrevOpen(true);
    if (members.length > 0) {
      const myId = currentUserId;
      const defaultPayerId = myId && members.some((m) => getMemberUserId(m) === myId)
        ? myId
        : getMemberUserId(members[0]);

      setPayers([{ userId: defaultPayerId, amount: 0 }]);
      setShareEntries(
        members.map((m) => ({
          userId: getMemberUserId(m),
          amount: 0,
          percentage: 0,
          ratio: 1,
          adjustment: 0,
        }))
      );
      setTotalAmount(0);
      setDescription('');
      setExpenseDate(new Date().toISOString().slice(0, 10));
      setSplitType(SPLIT_TYPE_VALUE.EQUAL);
      setCurrencyId(currencies[0]?.id ?? 1);
      setSelectedFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setSubmitError(null);
    }
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  // Payer helpers
  const payerTotal = useMemo(() => payers.reduce((s, p) => s + (p.amount || 0), 0), [payers]);

  const addPayer = () => {
    const usedIds = new Set(payers.map((p) => p.userId));
    const available = members.find((m) => !usedIds.has(getMemberUserId(m)));
    if (available) {
      setPayers([...payers, { userId: getMemberUserId(available), amount: 0 }]);
    }
  };

  const removePayer = (idx: number) => {
    if (payers.length > 1) setPayers(payers.filter((_, i) => i !== idx));
  };

  const updatePayerUser = (idx: number, userId: number) => {
    setPayers(payers.map((p, i) => (i === idx ? { ...p, userId } : p)));
  };

  const updatePayerAmount = (idx: number, amount: number) => {
    setPayers(payers.map((p, i) => (i === idx ? { ...p, amount } : p)));
  };

  // Share helpers
  const toggleShareMember = (uid: number) => {
    const existing = shareEntries.find((e) => e.userId === uid);
    if (existing) {
      if (shareEntries.length > 1) {
        setShareEntries(shareEntries.filter((e) => e.userId !== uid));
      }
    } else {
      const m = members.find((m) => getMemberUserId(m) === uid);
      if (m) {
        setShareEntries([...shareEntries, { userId: uid, amount: 0, percentage: 0, ratio: 1, adjustment: 0 }]);
      }
    }
  };

  const updateShareField = (uid: number, field: keyof ShareEntry, value: number) => {
    setShareEntries(shareEntries.map((e) => (e.userId === uid ? { ...e, [field]: value } : e)));
  };

  // Live calculation preview
  const preview = useMemo(
    () => previewShares(splitType, totalAmount, shareEntries),
    [splitType, totalAmount, shareEntries]
  );

  // Client-side validation
  const payerRemainder = totalAmount - payerTotal;
  const payerOk = Math.abs(payerRemainder) < 0.01;

  const shareValidation = useMemo(() => {
    switch (splitType) {
      case SPLIT_TYPE_VALUE.EXACT: {
        const sum = shareEntries.reduce((s, e) => s + (e.amount ?? 0), 0);
        return { ok: Math.abs(sum - totalAmount) < 0.01, hint: `Total: ${sum.toLocaleString()} / ${totalAmount.toLocaleString()}` };
      }
      case SPLIT_TYPE_VALUE.PERCENTAGE: {
        const sum = shareEntries.reduce((s, e) => s + (e.percentage ?? 0), 0);
        return { ok: Math.abs(sum - 100) < 0.01, hint: `Total %: ${sum.toFixed(1)}% / 100%` };
      }
      case SPLIT_TYPE_VALUE.SHARES: {
        const sum = shareEntries.reduce((s, e) => s + (e.ratio ?? 0), 0);
        return { ok: sum > 0 && shareEntries.every((e) => (e.ratio ?? 0) > 0), hint: `Total ratio: ${sum}` };
      }
      case SPLIT_TYPE_VALUE.ADJUSTMENT: {
        const sum = shareEntries.reduce((s, e) => s + (e.adjustment ?? 0), 0);
        return { ok: Math.abs(sum) < 0.01, hint: `Total adjustment: ${sum > 0 ? '+' : ''}${sum.toLocaleString()}` };
      }
      default:
        return { ok: shareEntries.length > 0, hint: `${shareEntries.length} members` };
    }
  }, [splitType, shareEntries, totalAmount]);

  // Build & Submit Payload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!description.trim()) { setSubmitError(t('createExpenseModal.descRequired')); return; }
    if (totalAmount <= 0) { setSubmitError(t('createExpenseModal.amountPositive')); return; }
    if (!currencyId) { setSubmitError(t('createExpenseModal.currencyRequired')); return; }
    if (!payerOk) {
      setSubmitError(t('createExpenseModal.payerMismatch', { payerTotal: payerTotal.toLocaleString(), totalAmount: totalAmount.toLocaleString() }));
      return;
    }
    if (!shareValidation.ok) { setSubmitError(`${t('createExpenseModal.invalidShares')}: ${shareValidation.hint}`); return; }
    if (shareEntries.length === 0) { setSubmitError(t('createExpenseModal.shareRequired')); return; }

    const sharesPayload: ExpenseSharePayload[] = shareEntries.map((e) => {
      const base: ExpenseSharePayload = { userId: e.userId };
      if (splitType === SPLIT_TYPE_VALUE.EXACT) base.amount = e.amount;
      if (splitType === SPLIT_TYPE_VALUE.PERCENTAGE) base.percentage = e.percentage;
      if (splitType === SPLIT_TYPE_VALUE.SHARES) base.ratio = e.ratio;
      if (splitType === SPLIT_TYPE_VALUE.ADJUSTMENT) base.adjustment = e.adjustment;
      return base;
    });

    onSubmit(
      {
        description: description.trim(),
        totalAmount,
        currencyId,
        expenseDate,
        splitType,
        payers: payers.map((p) => ({ userId: p.userId, amount: p.amount })),
        shares: sharesPayload,
      },
      selectedFiles
    );
  };

  const selectedCurr = currencies.find((c) => c.id === currencyId);
  const currencySymbol = selectedCurr?.code || selectedCurr?.acronym || selectedCurr?.symbol || 'VND';
  const splitTypeInfo = splitTypes.find((s) => s.value === splitType);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, fontSize: { xs: '1.15rem', sm: '1.3rem' } }}>
          {t('createExpenseModal.title')}
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '20px !important', px: { xs: 2, sm: 3 } }}>
          {submitError && <Alert intent="error">{submitError}</Alert>}

          {/* ── SECTION 1: Thông tin cơ bản ───────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {t('createExpenseModal.sectionInfo')}
            </Typography>

            <TextField
              label={t('createExpenseModal.descLabel')}
              placeholder={t('createExpenseModal.descPlaceholder')}
              fullWidth
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Responsive grid for Total Amount, Currency, and Expense Date */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField
                label={t('createExpenseModal.totalLabel')}
                type="number"
                fullWidth
                required
                value={totalAmount || ''}
                onChange={(e) => setTotalAmount(Math.max(0, Number(e.target.value)))}
                slotProps={{ input: { inputProps: { min: 0 } } }}
              />
              <TextField
                label={t('createExpenseModal.currencyLabel')}
                select
                fullWidth
                value={currencyId}
                onChange={(e) => setCurrencyId(Number(e.target.value))}
              >
                {currencies.map((c) => {
                  const codeLabel = c.code || c.acronym || c.symbol || '';
                  return (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name} {codeLabel ? `(${codeLabel})` : ''}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                label={t('createExpenseModal.dateLabel')}
                type="date"
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </Box>

            <TextField
              label={t('createExpenseModal.splitTypeLabel')}
              select
              fullWidth
              value={splitType}
              onChange={(e) => setSplitType(e.target.value as SplitType)}
              helperText={splitTypeInfo?.desc}
            >
              {splitTypes.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </TextField>

            {/* Receipt / Invoice Image Upload (Multiple Optional) */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'text.secondary' }}>
                {t('createExpenseModal.sectionReceiptImage')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {t('createExpenseModal.receiptImageHint')}
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
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, minWidth: 0 }}>
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
                              alt={`Receipt preview ${idx + 1}`}
                              sx={{ width: 48, height: 48, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                            />
                            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
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
                      + {t('createExpenseModal.selectReceiptImage')}
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
                  {t('createExpenseModal.selectReceiptImage')}
                </Button>
              )}
            </Box>
          </Box>

          <Divider />

          {/* ── SECTION 2: Người ứng tiền (Payers) ───────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {t('createExpenseModal.sectionPayers')}
              </Typography>
              <Chip
                label={payerOk
                  ? `✓ ${t('createExpenseModal.matched')}: ${payerTotal.toLocaleString()} ${currencySymbol}`
                  : `${t('createExpenseModal.missing')}: ${payerRemainder.toLocaleString()} ${currencySymbol}`
                }
                color={payerOk ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>

            {!payerOk && totalAmount > 0 && (
              <LinearProgress
                variant="determinate"
                value={Math.min((payerTotal / totalAmount) * 100, 100)}
                color={payerTotal > totalAmount ? 'error' : 'primary'}
                sx={{ borderRadius: 2, height: 6 }}
              />
            )}

            {payers.map((payer, idx) => (
              <Paper
                key={idx}
                variant="outlined"
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  alignItems: { xs: 'stretch', sm: 'center' },
                }}
              >
                <TextField
                  label={t('createExpenseModal.payerLabel')}
                  select
                  size="small"
                  sx={{ flex: 1 }}
                  value={payer.userId}
                  onChange={(e) => updatePayerUser(idx, Number(e.target.value))}
                >
                  {members.map((m) => {
                    const uid = getMemberUserId(m);
                    return (
                      <MenuItem key={uid} value={uid}>
                        {getMemberDisplayName(m)}
                      </MenuItem>
                    );
                  })}
                </TextField>

                <Box sx={{ display: 'flex', gap: 1, flex: 1, alignItems: 'center' }}>
                  <TextField
                    label={t('createExpenseModal.payerAmountLabel', { symbol: currencySymbol })}
                    type="number"
                    size="small"
                    fullWidth
                    value={payer.amount || ''}
                    onChange={(e) => updatePayerAmount(idx, Number(e.target.value))}
                    slotProps={{ input: { inputProps: { min: 0 } } }}
                  />

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removePayer(idx)}
                    disabled={payers.length <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}

            {payers.length < members.length && (
              <Button
                startIcon={<AddIcon />}
                size="small"
                variant="outlined"
                onClick={addPayer}
                sx={{ alignSelf: 'flex-start', mt: 0.5, borderRadius: 2 }}
              >
                {t('createExpenseModal.addPayerBtn')}
              </Button>
            )}
          </Box>

          <Divider />

          {/* ── SECTION 3: Người tham gia chia tiền (Shares) ─────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {t('createExpenseModal.sectionShares')}
              </Typography>
              <Chip
                label={shareValidation.hint}
                color={shareValidation.ok ? 'success' : 'warning'}
                size="small"
                icon={<InfoOutlinedIcon />}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              {splitType === SPLIT_TYPE_VALUE.EQUAL ? (
                /* EQUAL: Simple checkboxes */
                <FormGroup>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    {t('createExpenseModal.equalCheckPrompt')}
                  </Typography>
                  {members.map((m) => {
                    const uid = getMemberUserId(m);
                    const checked = shareEntries.some((e) => e.userId === uid);
                    const previewAmt = checked ? (preview.get(uid) ?? 0) : 0;
                    return (
                      <Box key={uid} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5, flexWrap: 'wrap', gap: 1 }}>
                        <FormControlLabel
                          control={<Checkbox checked={checked} onChange={() => toggleShareMember(uid)} />}
                          label={getMemberDisplayName(m)}
                        />
                        {checked && totalAmount > 0 && (
                          <Chip label={`${previewAmt.toLocaleString()} ${currencySymbol}`} size="small" color="primary" variant="outlined" />
                        )}
                      </Box>
                    );
                  })}
                </FormGroup>
              ) : (
                /* EXACT / PERCENTAGE / SHARES / ADJUSTMENT: Input per member */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {splitType === SPLIT_TYPE_VALUE.EXACT && t('createExpenseModal.exactHint')}
                    {splitType === SPLIT_TYPE_VALUE.PERCENTAGE && t('createExpenseModal.percentageHint')}
                    {splitType === SPLIT_TYPE_VALUE.SHARES && t('createExpenseModal.sharesHint')}
                    {splitType === SPLIT_TYPE_VALUE.ADJUSTMENT && t('createExpenseModal.adjustmentHint')}
                  </Typography>

                  {/* Add/Remove members toggle */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
                    {members.map((m) => {
                      const uid = getMemberUserId(m);
                      const included = shareEntries.some((e) => e.userId === uid);
                      return (
                        <Chip
                          key={uid}
                          label={getMemberUsername(m)}
                          size="small"
                          color={included ? 'primary' : 'default'}
                          variant={included ? 'filled' : 'outlined'}
                          onClick={() => toggleShareMember(uid)}
                          onDelete={included && shareEntries.length > 1 ? () => toggleShareMember(uid) : undefined}
                        />
                      );
                    })}
                  </Box>

                  {shareEntries.map((entry) => {
                    const member = members.find((m) => getMemberUserId(m) === entry.userId);
                    if (!member) return null;
                    const previewAmt = preview.get(entry.userId) ?? 0;

                    return (
                      <Box
                        key={entry.userId}
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 1.5,
                          alignItems: { xs: 'stretch', sm: 'center' },
                          py: 1,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 120 }}>
                          {getMemberDisplayName(member)}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
                          {splitType === SPLIT_TYPE_VALUE.EXACT && (
                            <TextField
                              label={t('createExpenseModal.exactLabel', { symbol: currencySymbol })}
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.amount || ''}
                              onChange={(e) => updateShareField(entry.userId, 'amount', Number(e.target.value))}
                              slotProps={{ input: { inputProps: { min: 0 } } }}
                            />
                          )}

                          {splitType === SPLIT_TYPE_VALUE.PERCENTAGE && (
                            <TextField
                              label={t('createExpenseModal.percentageLabel')}
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.percentage || ''}
                              onChange={(e) => updateShareField(entry.userId, 'percentage', Number(e.target.value))}
                              slotProps={{ input: { inputProps: { min: 0, max: 100, step: 0.1 } } }}
                            />
                          )}

                          {splitType === SPLIT_TYPE_VALUE.SHARES && (
                            <TextField
                              label={t('createExpenseModal.sharesLabel')}
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.ratio || ''}
                              onChange={(e) => updateShareField(entry.userId, 'ratio', Number(e.target.value))}
                              slotProps={{ input: { inputProps: { min: 1, step: 1 } } }}
                            />
                          )}

                          {splitType === SPLIT_TYPE_VALUE.ADJUSTMENT && (
                            <TextField
                              label={t('createExpenseModal.adjustmentLabel', { symbol: currencySymbol })}
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.adjustment || ''}
                              onChange={(e) => updateShareField(entry.userId, 'adjustment', Number(e.target.value))}
                            />
                          )}

                          <Tooltip title={`${t('createExpenseModal.estimated')}: ${previewAmt.toLocaleString()} ${currencySymbol}`}>
                            <Chip
                              label={totalAmount > 0 ? `≈ ${previewAmt.toLocaleString()}` : '—'}
                              size="small"
                              color={previewAmt >= 0 ? 'default' : 'error'}
                              sx={{ minWidth: 80 }}
                            />
                          </Tooltip>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Paper>
          </Box>

          {/* ── SECTION 4: Preview Tổng Kết ──────────────────────────────── */}
          {totalAmount > 0 && shareEntries.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('createExpenseModal.previewTitle')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {shareEntries.map((entry) => {
                  const member = members.find((m) => getMemberUserId(m) === entry.userId);
                  const amt = preview.get(entry.userId) ?? 0;
                  const isPayer = payers.some((p) => p.userId === entry.userId);
                  const payerPaid = payers.filter((p) => p.userId === entry.userId).reduce((s, p) => s + p.amount, 0);
                  const net = amt - payerPaid;

                  return (
                    <Paper
                      key={entry.userId}
                      elevation={1}
                      sx={{ p: 1.5, borderRadius: 2, minWidth: 120, flex: '1 0 120px' }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {member ? getMemberUsername(member) : `User ${entry.userId}`}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {amt.toLocaleString()} {currencySymbol}
                      </Typography>
                      {isPayer && payerPaid > 0 && (
                        <Typography variant="caption" color={net > 0 ? 'error.main' : 'success.main'} sx={{ display: 'block' }}>
                          {net > 0 ? `${t('createExpenseModal.collect')}: ${net.toLocaleString()}` : `${t('createExpenseModal.refund')}: ${Math.abs(net).toLocaleString()}`}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3, gap: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || !payerOk || !shareValidation.ok || totalAmount <= 0}
            startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {isPending ? t('createExpenseModal.submitting') : t('createExpenseModal.submit')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateExpenseModal;
