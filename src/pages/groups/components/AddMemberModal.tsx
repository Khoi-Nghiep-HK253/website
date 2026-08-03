import React, { useState } from 'react';
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

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { Alert } from '@/components';
import { useAllUsers } from '@/hooks/useUserQuery';
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

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  open,
  onClose,
  onSubmit,
  isPending,
  existingMembers = [],
  existingMemberUserIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [memberError, setMemberError] = useState<string | null>(null);

  const { data: allUsers = [], isPending: isLoadingUsers } = useAllUsers();

  // Filter out users already in the group by ID, username, or email
  const availableUsers = allUsers.filter((u) => {
    // 1. Check legacy ID array
    if (existingMemberUserIds.includes(u.id)) {
      return false;
    }

    // 2. Check existing members list by ID, username, or email
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

  // Search filter matching name, username or email
  const filteredUsers = availableUsers.filter((u) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const displayName = `${u.username} ${u.firstname || ''} ${u.lastname || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    return displayName.includes(query) || email.includes(query);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);

    if (!selectedUser) {
      setMemberError('Vui lòng chọn một thành viên từ danh sách.');
      return;
    }

    onSubmit({
      userId: selectedUser.id,
      message: invitationMessage.trim() || undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });
  };

  const handleCloseModal = () => {
    setSearchQuery('');
    setSelectedUser(null);
    setInvitationMessage('');
    setExpiresAt('');
    setMemberError(null);
    onClose();
  };

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

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          Mời Thành Viên Vào Nhóm
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {memberError && <Alert intent="error">{memberError}</Alert>}

          <Typography variant="body2" color="text.secondary">
            Tìm kiếm và chọn thành viên bên dưới để gửi lời mời tham gia nhóm chi tiêu.
          </Typography>

          {/* Search Input Field */}
          <TextField
            size="small"
            fullWidth
            placeholder="Tìm theo Tên, Username hoặc Email..."
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
                  Không tìm thấy người dùng phù hợp.
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {filteredUsers.map((u, idx) => {
                  const isSelected = selectedUser?.id === u.id;
                  const displayName = getDisplayName(u);
                  const initial = getInitial(u);
                  const email = u.email || 'Chưa cập nhật email';

                  return (
                    <React.Fragment key={u.id}>
                      {idx > 0 && <Divider component="li" />}
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => {
                          setSelectedUser(u);
                          setMemberError(null);
                        }}
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

          {/* Optional Invitation Message Field (message) */}
          <TextField
            size="small"
            fullWidth
            label="Lời nhắn đính kèm"
            placeholder="Ví dụ: Đi Đà Lạt cùng bọn mình nhé!"
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
            multiline
            rows={2}
          />

          {/* Optional Expiration Date Field (expires_at) */}
          <TextField
            size="small"
            fullWidth
            type="datetime-local"
            label="Thời hạn lời mời"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={isPending || !selectedUser}>
            {isPending ? <CircularProgress size={20} color="inherit" /> : 'Gửi Lời Mời'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
