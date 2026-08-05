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
import { useTranslation } from 'react-i18next';
import { useMyGroups, useCreateGroupMutation } from '@/hooks/query/useGroupQuery';
import { useCategories } from '@/hooks/query/useMasterQuery';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { useToast } from '@/hooks/common/useToast';
import { Alert } from '@/components';
import { GroupCardItem, CreateGroupModal } from './components';

export default function GroupsListPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('groups.title'));
  const navigate = useNavigate();
  const { data: myGroupsData, isPending, error } = useMyGroups();
  const { data: categories = [] } = useCategories();
  const createGroupMutation = useCreateGroupMutation();
  const { showSuccess, showError } = useToast();

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
        showSuccess(`Tạo nhóm "${newGroup.name}" thành công!`);
        navigate(`/groups/${newGroup.id}`);
      },
      onError: (err) => {
        showError(`Tạo nhóm thất bại: ${err.message || 'Vui lòng thử lại'}`);
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {t('groups.title')}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            {t('groups.subTitle')}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<GroupAddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ borderRadius: 3, fontWeight: 700, px: 3 }}
        >
          {t('groups.createGroup')}
        </Button>
      </Box>

      {/* Search & Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder={t('groups.searchPlaceholder')}
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
        <Alert intent="error" title={t('groups.loadError')}>
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
            {t('groups.emptyTitle')}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mb: 3 }}>
            {t('groups.emptySub')}
          </Typography>

          <Button
            variant="contained"
            startIcon={<GroupAddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('groups.createFirstGroup')}
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
