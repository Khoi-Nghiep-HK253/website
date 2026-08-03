import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { GroupResponse } from '@/services/groupService';

interface MyGroupsTabContentProps {
  groupsList: GroupResponse[];
  onNavigateToGroup: (groupId: number) => void;
}

export const MyGroupsTabContent: React.FC<MyGroupsTabContentProps> = ({
  groupsList,
  onNavigateToGroup,
}) => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Danh Sách Nhóm Đã Tham Gia ({groupsList.length})
      </Typography>

      {groupsList.length === 0 ? (
        <Typography color="text.secondary">Chưa có nhóm nào.</Typography>
      ) : (
        <List disablePadding>
          {groupsList.map((g, idx) => (
            <React.Fragment key={g.id}>
              {idx > 0 && <Divider component="li" />}
              <ListItem
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => onNavigateToGroup(g.id)}
                secondaryAction={
                  <Button size="small" variant="outlined" endIcon={<ArrowForwardIcon />}>
                    Chi Tiết
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <GroupIcon color="primary" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {g.name}
                    </Typography>
                  }
                  secondary={`Ghi chú: ${g.note || 'Không có'} • Danh mục: ${g.categoryName || 'Chung'}`}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};
