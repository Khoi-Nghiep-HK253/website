import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { Alert } from '@/components';
import { useAllUsers } from '@/hooks/query/useUserQuery';
import type { UserResponse } from '@/services/authService';
import type { GroupMemberResponse } from '@/services/groupService';

export interface SendInvitationPayloadData {
  userId: number;
  message?: string;
  expiresAt?: string;
}

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: SendInvitationPayloadData) => void;
  isPending: boolean;
  existingMembers?: GroupMemberResponse[];
  existingMemberUserIds?: number[];
}

// ── Static Member Display Helpers ────────────────────────────────────────────
const getDisplayName = (u: UserResponse): string => {
  const fullName = `${u.firstname || ''} ${u.lastname || ''}`.trim();
  if (fullName) {
    return `${u.username} (${fullName})`;
  }
  return u.username;
};

const getInitial = (u: UserResponse): string => {
  if (u.username) return u.username.charAt(0).toUpperCase();
  if (u.email) return u.email.charAt(0).toUpperCase();
  return 'U';
};

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onClose,
  onSubmit,
  isPending,
  existingMembers = [],
  existingMemberUserIds = [],
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [memberError, setMemberError] = useState<string | null>(null);

  const { data: allUsers = [], isPending: isLoadingUsers } = useAllUsers();

  // 1. Filter out users already in the group (memoized with useMemo)
  const availableUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Check legacy ID array
      if (existingMemberUserIds.includes(u.id)) {
        return false;
      }

      // Check existing members list by ID, username, or email
      const isAlreadyMember = existingMembers.some((m) => {
        const memberUserId = m.user?.id || m.userId;
        if (memberUserId && Number(memberUserId) === Number(u.id)) {
          return true;
        }
        const memberUsername = m.user?.username || m.username;
        if (memberUsername && memberUsername.toLowerCase() === u.username?.toLowerCase()) {
          return true;
        }
        const memberEmail = m.user?.email || m.email;
        if (memberEmail && u.email && memberEmail.toLowerCase() === u.email?.toLowerCase()) {
          return true;
        }
        return false;
      });

      return !isAlreadyMember;
    });
  }, [allUsers, existingMembers, existingMemberUserIds]);

  // 2. Search filter matching name, username or email (memoized with useMemo)
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return availableUsers;
    const query = searchQuery.toLowerCase().trim();
    return availableUsers.filter((u) => {
      const displayName = `${u.username} ${u.firstname || ''} ${u.lastname || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      return displayName.includes(query) || email.includes(query);
    });
  }, [availableUsers, searchQuery]);

  // 3. User select callback (memoized with useCallback)
  const handleSelectUser = useCallback((u: UserResponse) => {
    setSelectedUser(u);
    setMemberError(null);
  }, []);

  // 4. Modal submit handler (memoized with useCallback)
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setMemberError(null);

      if (!selectedUser) {
        setMemberError(t('invitation.selectUserMsg'));
        return;
      }

      onSubmit({
        userId: selectedUser.id,
        message: invitationMessage.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });
    },
    [expiresAt, invitationMessage, onSubmit, selectedUser, t]
  );

  // 5. Modal close reset handler (memoized with useCallback)
  const handleCloseModal = useCallback(() => {
    setSearchQuery('');
    setSelectedUser(null);
    setInvitationMessage('');
    setExpiresAt('');
    setMemberError(null);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          {t('groupDetail.inviteMemberBtn')}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '20px !important' }}>
          {memberError && <Alert intent="error">{memberError}</Alert>}

          <Typography variant="body2" color="text.secondary">
            {t('invitation.searchPrompt')}
          </Typography>

          {/* Search Input Field */}
          <TextField
            size="small"
            fullWidth
            placeholder={t('common.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Inline Scrollable List of Matching Users */}
          <Paper variant="outlined" sx={{ maxHeight: 220, overflowY: 'auto', borderRadius: 3 }}>
            {isLoadingUsers ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={32} />
              </Box>
            ) : filteredUsers.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('invitation.noUserFound')}
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {filteredUsers.map((u, idx) => {
                  const isSelected = selectedUser?.id === u.id;
                  const displayName = getDisplayName(u);
                  const initial = getInitial(u);
                  const email = u.email || '';

                  return (
                    <React.Fragment key={u.id}>
                      {idx > 0 && <Divider component="li" />}
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => handleSelectUser(u)}
                        sx={{
                          py: 1.2,
                          px: 2,
                          bgcolor: isSelected ? 'action.selected' : 'transparent',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: isSelected ? 'primary.main' : 'primary.light', fontWeight: 700 }}>
                            {initial}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: isSelected ? 800 : 600 }}>
                              {displayName}
                            </Typography>
                          }
                          secondary={email}
                        />
                        {isSelected && <CheckCircleIcon color="primary" />}
                      </ListItemButton>
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>

          {/* Optional Invitation Message Field */}
          <TextField
            size="small"
            fullWidth
            label={t('invitation.messageLabel')}
            placeholder={t('invitation.messagePlaceholder')}
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
            multiline
            rows={2}
          />

          {/* Optional Expiration Date Field */}
          <TextField
            size="small"
            fullWidth
            type="datetime-local"
            label={t('invitation.expiryLabel')}
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleCloseModal} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isPending || !selectedUser}>
            {isPending ? <CircularProgress size={20} color="inherit" /> : t('invitation.sendInviteBtn')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
