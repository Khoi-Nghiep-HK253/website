import { useState, useMemo, useCallback } from 'react';
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
import { PATHS } from '@/router/routes';
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

  const groupsList = useMemo(() => {
    return myGroupsData?.content || [];
  }, [myGroupsData]);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return groupsList;
    return groupsList.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.note && g.note.toLowerCase().includes(q))
    );
  }, [groupsList, searchQuery]);

  const handleNavigateDetail = useCallback(
    (groupId: number) => {
      navigate(PATHS.GROUPS.DETAIL(groupId));
    },
    [navigate]
  );

  const handleCreateGroupSubmit = useCallback(
    (data: {
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
          navigate(PATHS.GROUPS.DETAIL(newGroup.id));
        },
        onError: (err) => {
          showError(`Tạo nhóm thất bại: ${err.message || 'Vui lòng thử lại'}`);
        },
      });
    },
    [createGroupMutation, navigate, showError, showSuccess]
  );

  const handleOpenCreateDialog = useCallback(() => {
    setOpenCreateDialog(true);
  }, []);

  const handleCloseCreateDialog = useCallback(() => {
    setOpenCreateDialog(false);
  }, []);

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
          color="primary"
          startIcon={<GroupAddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ borderRadius: 3, px: 3, py: 1.2, fontWeight: 700 }}
        >
          {t('groups.createBtn')}
        </Button>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={t('groups.searchPlaceholder')}
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
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
      </Paper>

      {/* Loading state */}
      {isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={44} />
        </Box>
      )}

      {/* Error state */}
      {error && !isPending && (
        <Alert intent="error" title={t('groups.errorAlertTitle')}>
          {error.message || t('groups.loadFailed')}
        </Alert>
      )}

      {/* Empty State */}
      {!isPending && !error && filteredGroups.length === 0 && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            bgcolor: 'action.hover',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.light', mx: 'auto', mb: 2 }}>
            <GroupAddIcon sx={{ fontSize: 36, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {searchQuery ? t('groups.noGroupFound') : t('groups.emptyTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery ? t('groups.tryAnotherSearch') : t('groups.emptySub')}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<GroupAddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              {t('groups.createBtn')}
            </Button>
          )}
        </Paper>
      )}

      {/* Groups Grid */}
      {!isPending && !error && filteredGroups.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredGroups.map((group) => (
            <GroupCardItem key={group.id} group={group} onNavigateDetail={handleNavigateDetail} />
          ))}
        </Box>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateGroupSubmit}
        categories={categories}
        isPending={createGroupMutation.isPending}
      />
    </Box>
  );
}
