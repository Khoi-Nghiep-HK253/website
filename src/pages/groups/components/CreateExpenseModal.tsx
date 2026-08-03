import React, { useState, useEffect, useMemo } from 'react';
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
import type { CurrencyResponse } from '@/services/currencyService';
import type { GroupMemberResponse } from '@/services/groupService';
import type { CreateExpensePayload, ExpenseSharePayload } from '@/services/expenseService';
import { Alert } from '@/components';

// ── Types ────────────────────────────────────────────────────────────────────
type SplitType = 'EQUAL' | 'EXACT' | 'PERCENTAGE' | 'SHARES' | 'ADJUSTMENT';

interface PayerEntry {
  userId: number;
  amount: number;
}

interface ShareEntry {
  userId: number;
  amount?: number;
  percentage?: number;
  ratio?: number;
  adjustment?: number;
}

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
  currencies: CurrencyResponse[];
  members: GroupMemberResponse[];
  currentUserId?: number;
  onSubmit: (payload: CreateExpensePayload) => void;
  isPending: boolean;
}

// ── Member Helpers ────────────────────────────────────────────────────────────
const getMemberUsername = (m: GroupMemberResponse): string =>
  m.user?.username || m.username || `User #${m.userId || m.id}`;

const getMemberDisplayName = (m: GroupMemberResponse): string => {
  const uname = getMemberUsername(m);
  const fname = m.user?.firstname || m.firstname;
  const lname = m.user?.lastname || m.lastname;
  return fname ? `${uname} (${fname} ${lname || ''})`.trim() : uname;
};

const getMemberUserId = (m: GroupMemberResponse): number =>
  m.user?.id || m.userId || m.id;

// ── SplitType metadata ────────────────────────────────────────────────────────
const SPLIT_TYPES: { value: SplitType; label: string; desc: string }[] = [
  { value: 'EQUAL', label: 'Chia đều (EQUAL)', desc: 'Tất cả tham gia trả phần bằng nhau' },
  { value: 'EXACT', label: 'Số tiền cụ thể (EXACT)', desc: 'Nhập số tiền chính xác cho từng người' },
  { value: 'PERCENTAGE', label: 'Theo phần trăm (PERCENTAGE)', desc: 'Nhập % phần trả, tổng phải = 100%' },
  { value: 'SHARES', label: 'Theo khẩu phần (SHARES)', desc: 'Nhập số phần chia, backend tự tính tỷ lệ' },
  { value: 'ADJUSTMENT', label: 'Điều chỉnh thêm (ADJUSTMENT)', desc: 'Chia đều + điều chỉnh ±, tổng điều chỉnh = 0' },
];

// ── Client-side amount preview calculator ────────────────────────────────────
function previewShares(
  splitType: SplitType,
  totalAmount: number,
  shareEntries: ShareEntry[]
): Map<number, number> {
  const result = new Map<number, number>();
  const count = shareEntries.length;
  if (count === 0) return result;

  switch (splitType) {
    case 'EQUAL': {
      const equal = Math.floor((totalAmount / count) * 100) / 100;
      const remainder = Math.round((totalAmount - equal * count) * 100) / 100;
      shareEntries.forEach((e, i) => result.set(e.userId, i === 0 ? equal + remainder : equal));
      break;
    }
    case 'EXACT': {
      shareEntries.forEach((e) => result.set(e.userId, e.amount ?? 0));
      break;
    }
    case 'PERCENTAGE': {
      shareEntries.forEach((e) => {
        const amt = Math.round(totalAmount * (e.percentage ?? 0)) / 100;
        result.set(e.userId, amt);
      });
      break;
    }
    case 'SHARES': {
      const totalRatio = shareEntries.reduce((sum, e) => sum + (e.ratio ?? 0), 0);
      if (totalRatio > 0) {
        shareEntries.forEach((e) => {
          const amt = Math.round((totalAmount * (e.ratio ?? 0)) / totalRatio * 100) / 100;
          result.set(e.userId, amt);
        });
      }
      break;
    }
    case 'ADJUSTMENT': {
      const base = Math.floor((totalAmount / count) * 100) / 100;
      const baseRemainder = Math.round((totalAmount - base * count) * 100) / 100;
      shareEntries.forEach((e, i) => {
        const adj = e.adjustment ?? 0;
        result.set(e.userId, base + adj + (i === 0 ? baseRemainder : 0));
      });
      break;
    }
  }
  return result;
}

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
  // Basic info
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [currencyId, setCurrencyId] = useState<number>(currencies[0]?.id ?? 1);
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [splitType, setSplitType] = useState<SplitType>('EQUAL');

  // Payers
  const [payers, setPayers] = useState<PayerEntry[]>([]);

  // Shares
  const [shareEntries, setShareEntries] = useState<ShareEntry[]>([]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialise payers & shares when members load or modal opens
  useEffect(() => {
    if (!open || members.length === 0) return;

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
    setSplitType('EQUAL');
    setCurrencyId(currencies[0]?.id ?? 1);
    setSubmitError(null);
  }, [open, members, currentUserId, currencies]);

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
      case 'EXACT': {
        const sum = shareEntries.reduce((s, e) => s + (e.amount ?? 0), 0);
        return { ok: Math.abs(sum - totalAmount) < 0.01, hint: `Tổng: ${sum.toLocaleString()} / ${totalAmount.toLocaleString()}` };
      }
      case 'PERCENTAGE': {
        const sum = shareEntries.reduce((s, e) => s + (e.percentage ?? 0), 0);
        return { ok: Math.abs(sum - 100) < 0.01, hint: `Tổng %: ${sum.toFixed(1)}% / 100%` };
      }
      case 'SHARES': {
        const sum = shareEntries.reduce((s, e) => s + (e.ratio ?? 0), 0);
        return { ok: sum > 0 && shareEntries.every((e) => (e.ratio ?? 0) > 0), hint: `Tổng khẩu phần: ${sum}` };
      }
      case 'ADJUSTMENT': {
        const sum = shareEntries.reduce((s, e) => s + (e.adjustment ?? 0), 0);
        return { ok: Math.abs(sum) < 0.01, hint: `Tổng điều chỉnh: ${sum > 0 ? '+' : ''}${sum.toLocaleString()} (phải = 0)` };
      }
      default:
        return { ok: shareEntries.length > 0, hint: `${shareEntries.length} thành viên tham gia` };
    }
  }, [splitType, shareEntries, totalAmount]);

  // Build & Submit Payload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!description.trim()) { setSubmitError('Vui lòng nhập mô tả khoản chi.'); return; }
    if (totalAmount <= 0) { setSubmitError('Tổng số tiền phải lớn hơn 0.'); return; }
    if (!currencyId) { setSubmitError('Vui lòng chọn loại tiền tệ.'); return; }
    if (!payerOk) { setSubmitError(`Tổng tiền người ứng (${payerTotal.toLocaleString()}) chưa khớp với tổng chi phí (${totalAmount.toLocaleString()}). Vui lòng điều chỉnh.`); return; }
    if (!shareValidation.ok) { setSubmitError(`Chia tiền chưa hợp lệ: ${shareValidation.hint}`); return; }
    if (shareEntries.length === 0) { setSubmitError('Phải có ít nhất 1 người tham gia chia tiền.'); return; }

    const sharesPayload: ExpenseSharePayload[] = shareEntries.map((e) => {
      const base: ExpenseSharePayload = { userId: e.userId };
      if (splitType === 'EXACT') base.amount = e.amount;
      if (splitType === 'PERCENTAGE') base.percentage = e.percentage;
      if (splitType === 'SHARES') base.ratio = e.ratio;
      if (splitType === 'ADJUSTMENT') base.adjustment = e.adjustment;
      return base;
    });

    onSubmit({
      description: description.trim(),
      totalAmount,
      currencyId,
      expenseDate,
      splitType,
      payers: payers.map((p) => ({ userId: p.userId, amount: p.amount })),
      shares: sharesPayload,
    });
  };

  const selectedCurr = currencies.find((c) => c.id === currencyId);
  const currencySymbol = selectedCurr?.code || selectedCurr?.acronym || selectedCurr?.symbol || 'VND';
  const splitTypeInfo = SPLIT_TYPES.find((s) => s.value === splitType);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, fontSize: { xs: '1.15rem', sm: '1.3rem' } }}>
          Thêm Khoản Chi Mới
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1, px: { xs: 2, sm: 3 } }}>
          {submitError && <Alert intent="error">{submitError}</Alert>}

          {/* ── SECTION 1: Thông tin cơ bản ───────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Thông Tin Khoản Chi
            </Typography>

            <TextField
              label="Mô tả khoản chi *"
              placeholder="VD: Tiền lẩu, Xăng xe, Phòng khách sạn..."
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
                label="Tổng số tiền *"
                type="number"
                fullWidth
                required
                value={totalAmount || ''}
                onChange={(e) => setTotalAmount(Math.max(0, Number(e.target.value)))}
                slotProps={{ input: { inputProps: { min: 0 } } }}
              />
              <TextField
                label="Loại tiền tệ"
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
                label="Ngày chi tiêu *"
                type="date"
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </Box>

            <TextField
              label="Cách chia tiền"
              select
              fullWidth
              value={splitType}
              onChange={(e) => setSplitType(e.target.value as SplitType)}
              helperText={splitTypeInfo?.desc}
            >
              {SPLIT_TYPES.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider />

          {/* ── SECTION 2: Người ứng tiền (Payers) ───────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Người Ứng Tiền Trước
              </Typography>
              <Chip
                label={payerOk
                  ? `✓ Khớp: ${payerTotal.toLocaleString()} ${currencySymbol}`
                  : `Còn thiếu: ${payerRemainder.toLocaleString()} ${currencySymbol}`
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
                  label="Người ứng"
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
                    label={`Số tiền đã ứng (${currencySymbol})`}
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
                Thêm người ứng tiền
              </Button>
            )}
          </Box>

          <Divider />

          {/* ── SECTION 3: Người tham gia chia tiền (Shares) ─────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Chia Tiền Cho Từng Người
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
              {splitType === 'EQUAL' ? (
                /* EQUAL: Simple checkboxes */
                <FormGroup>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Tích chọn những người sẽ chia đều khoản chi này:
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
                    {splitType === 'EXACT' && 'Nhập số tiền chính xác mỗi người trả. Tổng phải = tổng chi phí.'}
                    {splitType === 'PERCENTAGE' && 'Nhập % của tổng chi phí. Tổng phải = 100%.'}
                    {splitType === 'SHARES' && 'Nhập số khẩu phần (≥1) của từng người. Tỷ lệ tự động tính.'}
                    {splitType === 'ADJUSTMENT' && 'Nhập điều chỉnh ± so với chia đều. Tổng điều chỉnh phải = 0.'}
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
                          {splitType === 'EXACT' && (
                            <TextField
                              label={`Số tiền (${currencySymbol})`}
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.amount || ''}
                              onChange={(e) => updateShareField(entry.userId, 'amount', Number(e.target.value))}
                              slotProps={{ input: { inputProps: { min: 0 } } }}
                            />
                          )}

                          {splitType === 'PERCENTAGE' && (
                            <TextField
                              label="Phần trăm (%)"
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.percentage || ''}
                              onChange={(e) => updateShareField(entry.userId, 'percentage', Number(e.target.value))}
                              slotProps={{ input: { inputProps: { min: 0, max: 100, step: 0.1 } } }}
                            />
                          )}

                          {splitType === 'SHARES' && (
                            <TextField
                              label="Số phần (ratio)"
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.ratio || ''}
                              onChange={(e) => updateShareField(entry.userId, 'ratio', Number(e.target.value))}
                              slotProps={{ input: { inputProps: { min: 1, step: 1 } } }}
                            />
                          )}

                          {splitType === 'ADJUSTMENT' && (
                            <TextField
                              label={`Điều chỉnh (${currencySymbol})`}
                              type="number"
                              size="small"
                              fullWidth
                              value={entry.adjustment || ''}
                              onChange={(e) => updateShareField(entry.userId, 'adjustment', Number(e.target.value))}
                            />
                          )}

                          <Tooltip title={`Dự kiến: ${previewAmt.toLocaleString()} ${currencySymbol}`}>
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
                Preview – Từng Người Phải Trả
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
                          {net > 0 ? `Cần thu: ${net.toLocaleString()}` : `Nhận lại: ${Math.abs(net).toLocaleString()}`}
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
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || !payerOk || !shareValidation.ok || totalAmount <= 0}
            startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {isPending ? 'Đang tạo...' : 'Tạo Khoản Chi'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
