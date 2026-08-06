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
import { Alert } from '@/components';
import { useGroupsListStore } from './hooks/useGroupsListStore';
import { GroupCardItem, CreateGroupModal } from './components';

export default function GroupsListPage() {
  const {
    t,
    isPending,
    error,
    categories,
    filteredGroups,
    searchQuery,
    setSearchQuery,
    openCreateDialog,
    handleNavigateDetail,
    handleCreateGroupSubmit,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    isCreatePending,
  } = useGroupsListStore();

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
        isPending={isCreatePending}
      />
    </Box>
  );
}
