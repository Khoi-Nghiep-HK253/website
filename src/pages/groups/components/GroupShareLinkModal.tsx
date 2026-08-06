import React, { useState, useMemo, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { DeleteOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import type { ShareLinkResponse } from '@/services/groupShareLinkService';
import {
  useGroupShareLinks,
  useCreateShareLinkMutation,
  useRevokeShareLinkMutation,
} from '@/hooks/query/useGroupShareLinkQuery';
import { useToast } from '@/hooks/common/useToast';
import { getFullShareUrl, generateQrCodeUrl } from '@/core/helpers/shareLinkHelper';

interface GroupShareLinkModalProps {
  open: boolean;
  onClose: () => void;
  groupId: number;
  isOwner?: boolean;
}

export const GroupShareLinkModal: React.FC<GroupShareLinkModalProps> = ({
  open,
  onClose,
  groupId,
  isOwner = false,
}) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();

  const [expireHours, setExpireHours] = useState<number>(168); // Default 7 days
  const [maxUses, setMaxUses] = useState<number>(0); // 0 = unlimited
  const [selectedLink, setSelectedLink] = useState<ShareLinkResponse | null>(null);

  // TanStack Query Hooks
  const { data: links = [], isPending: loading } = useGroupShareLinks(groupId, open);
  const createShareLinkMutation = useCreateShareLinkMutation();
  const revokeShareLinkMutation = useRevokeShareLinkMutation();

  const handleCreateLink = useCallback(() => {
    createShareLinkMutation.mutate(
      {
        groupId,
        payload: {
          expireHours: expireHours > 0 ? expireHours : undefined,
          maxUses: maxUses > 0 ? maxUses : undefined,
        },
      },
      {
        onSuccess: (newLink) => {
          showSuccess(t('shareLink.title'));
          setSelectedLink(newLink);
        },
        onError: (err) => {
          showError(err.message || 'Failed to create share link');
        },
      }
    );
  }, [createShareLinkMutation, expireHours, groupId, maxUses, showError, showSuccess, t]);

  const handleRevoke = useCallback(
    (linkId: number) => {
      revokeShareLinkMutation.mutate(
        { groupId, linkId },
        {
          onSuccess: () => {
            showSuccess(t('shareLink.revokeSuccess'));
            if (selectedLink?.id === linkId) {
              setSelectedLink(null);
            }
          },
          onError: (err) => {
            showError(err.message || 'Failed to revoke share link');
          },
        }
      );
    },
    [groupId, revokeShareLinkMutation, selectedLink?.id, showError, showSuccess, t]
  );

  const handleCopy = useCallback(
    (code: string) => {
      const url = getFullShareUrl(code);
      navigator.clipboard.writeText(url);
      showSuccess(t('shareLink.copySuccess'));
    },
    [showSuccess, t]
  );

  // Memoize activeLink and qrCodeUrl calculation
  const activeLink = useMemo(() => {
    return selectedLink || links.find((l) => l.status === 'ACTIVE') || links[0] || null;
  }, [selectedLink, links]);

  const qrCodeUrl = useMemo(() => {
    return activeLink ? generateQrCodeUrl(activeLink.inviteCode) : '';
  }, [activeLink]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t('shareLink.title')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Owner Create Section */}
            {isOwner && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  {t('shareLink.createBtn')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label={t('shareLink.expireLabel')}
                    value={expireHours}
                    onChange={(e) => setExpireHours(Number(e.target.value))}
                  >
                    <MenuItem value={24}>{t('shareLink.expire24h')}</MenuItem>
                    <MenuItem value={168}>{t('shareLink.expire7d')}</MenuItem>
                    <MenuItem value={720}>{t('shareLink.expire30d')}</MenuItem>
                    <MenuItem value={0}>{t('shareLink.expireNever')}</MenuItem>
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label={t('shareLink.maxUsesLabel')}
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                  >
                    <MenuItem value={0}>{t('shareLink.maxUsesUnlimited')}</MenuItem>
                    <MenuItem value={10}>{t('shareLink.maxUses10')}</MenuItem>
                    <MenuItem value={50}>{t('shareLink.maxUses50')}</MenuItem>
                  </TextField>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCreateLink}
                  disabled={createShareLinkMutation.isPending}
                  startIcon={
                    createShareLinkMutation.isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <QrCode2Icon />
                    )
                  }
                >
                  {t('shareLink.generateBtn')}
                </Button>
              </Paper>
            )}

            {/* Active Link Preview & QR Code */}
            {activeLink && activeLink.status === 'ACTIVE' ? (
              <Box sx={{ textAlign: 'center' }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 3, display: 'inline-block', mb: 2, bgcolor: '#ffffff' }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="Group Join QR Code"
                    style={{ width: 180, height: 180, display: 'block' }}
                  />
                </Paper>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 2 }}>
                  {t('shareLink.qrInstruction')}
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" noWrap sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {getFullShareUrl(activeLink.inviteCode)}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleCopy(activeLink.inviteCode)}
                  >
                    {t('shareLink.copyBtn')}
                  </Button>
                </Paper>
              </Box>
            ) : (
              <Alert severity="info">
                {t('shareLink.activeLinksTitle')} – Bấm "Tạo Link Chia Sẻ" ở trên để sinh mã mới.
              </Alert>
            )}

            {/* List of existing links */}
            {links.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  {t('shareLink.activeLinksTitle')}
                </Typography>
                <Stack spacing={1}>
                  {links.map((link) => (
                    <Paper
                      key={link.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ overflow: 'hidden', mr: 1 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                            code: {link.inviteCode}
                          </Typography>
                          <Chip
                            label={
                              link.status === 'ACTIVE'
                                ? t('shareLink.statusActive')
                                : link.status === 'EXPIRED'
                                  ? t('shareLink.statusExpired')
                                  : t('shareLink.statusRevoked')
                            }
                            color={link.status === 'ACTIVE' ? 'success' : 'default'}
                            size="small"
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {t('shareLink.usedCount', {
                            used: link.usedCount,
                            max: link.maxUses ? link.maxUses : '∞',
                          })}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => handleCopy(link.inviteCode)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        {isOwner && link.status === 'ACTIVE' && (
                          <IconButton
                            size="small"
                            color="error"
                            disabled={revokeShareLinkMutation.isPending}
                            onClick={() => handleRevoke(link.id)}
                          >
                            <DeleteOutlined fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
