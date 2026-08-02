import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import type { GroupMemberResponse } from '@/services/groupService';

interface MembersTabContentProps {
  members: GroupMemberResponse[];
  onOpenAddMemberModal: () => void;
  onRemoveMember: (memberId: number) => void;
}

const getMemberUsername = (m: GroupMemberResponse): string => {
  return m.user?.username || m.username || (m.userId ? `User #${m.userId}` : 'Thành viên');
};

const getMemberInitial = (m: GroupMemberResponse): string => {
  const uname = getMemberUsername(m);
  return (uname && uname.length > 0 ? uname.charAt(0) : 'M').toUpperCase();
};

const getMemberDisplayName = (m: GroupMemberResponse): string => {
  const uname = getMemberUsername(m);
  const fname = m.user?.firstname || m.firstname;
  const lname = m.user?.lastname || m.lastname;
  if (fname) {
    return `${uname} (${fname} ${lname || ''})`.trim();
  }
  return uname;
};

export const MembersTabContent: React.FC<MembersTabContentProps> = ({
  members,
  onOpenAddMemberModal,
  onRemoveMember,
}) => {
  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Danh Sách Thành Viên ({members.length})
        </Typography>
        <Button size="small" variant="contained" startIcon={<PersonAddIcon />} onClick={onOpenAddMemberModal}>
          Thêm Thành Viên
        </Button>
      </Box>

      <List disablePadding>
        {members.map((m, idx) => {
          const displayName = getMemberDisplayName(m);
          const initial = getMemberInitial(m);
          const email = m.user?.email || m.email || '';

          return (
            <React.Fragment key={m.id}>
              {idx > 0 && <Divider component="li" />}
              <ListItem
                sx={{ py: 1.5 }}
                secondaryAction={
                  m.role !== 'OWNER' && (
                    <IconButton color="error" onClick={() => onRemoveMember(m.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>{initial}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {displayName}
                    </Typography>
                  }
                  secondary={email || undefined}
                />
                <Chip label={m.role} color={m.role === 'OWNER' ? 'primary' : 'default'} size="small" sx={{ mr: 2 }} />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};
