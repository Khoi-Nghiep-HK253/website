import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useMyGroups, useCreateGroupMutation } from '@/hooks/useGroupQuery';
import { useCategories } from '@/hooks/useMasterQuery';
import { Alert } from '@/components';
import { GroupCardItem, CreateGroupModal } from './components';

export default function GroupsListPage() {
  const navigate = useNavigate();
  const { data: myGroupsData, isPending, error } = useMyGroups();
  const { data: categories = [] } = useCategories();
  const createGroupMutation = useCreateGroupMutation();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const groupsList = myGroupsData?.content || [];

  const filteredGroups = groupsList.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.note && g.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateGroupSubmit = (data: {
    name: string;
    categoryId?: number;
    note?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    createGroupMutation.mutate(data, {
      onSuccess: (newGroup) => {
        setOpenCreateDialog(false);
        navigate(`/groups/${newGroup.id}`);
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Danh Sách Nhóm Chi Tiêu
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            Tạo nhóm, mời bạn bè và quản lý khoản chi chung minh bạch cùng Divvy
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<GroupAddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ borderRadius: 3, fontWeight: 700, px: 3 }}
        >
          Tạo Nhóm Mới
        </Button>
      </Box>

      {/* Search & Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Tìm kiếm theo tên nhóm hoặc ghi chú..."
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert intent="error" title="Không thể tải danh sách nhóm">
          {error.message}
        </Alert>
      )}

      {/* Loading state */}
      {isPending ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : filteredGroups.length === 0 ? (
        /* Empty State */
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'background.paper' }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <GroupAddIcon sx={{ fontSize: 36 }} />
          </Avatar>

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Chưa có nhóm chi tiêu nào
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mb: 3 }}>
            Tạo nhóm mới để bắt đầu ghi nhận các khoản ăn uống, du lịch, sinh hoạt chung cùng bạn bè!
          </Typography>

          <Button
            variant="contained"
            startIcon={<GroupAddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            Tạo Nhóm Đầu Tiên
          </Button>
        </Paper>
      ) : (
        /* Groups Grid */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {filteredGroups.map((group) => (
            <GroupCardItem
              key={group.id}
              group={group}
              onNavigateDetail={(gid) => navigate(`/groups/${gid}`)}
            />
          ))}
        </Box>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        categories={categories}
        onSubmit={handleCreateGroupSubmit}
        isPending={createGroupMutation.isPending}
      />
    </Box>
  );
}
