import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { Alert } from '@/components';
import { useGroupsListStore } from './hooks/useGroupsListStore';
import { GroupCardItem, CreateGroupModal, GroupsListEmptyState } from './components';

export default function GroupsListPage() {
  const {
    t,
    isPending,
    error,
    categories,
    uniqueCreators,
    filteredGroups,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedCreatorId,
    setSelectedCreatorId,
    isFiltered,
    handleClearFilters,
    openCreateDialog,
    handleNavigateDetail,
    handleCreateGroupSubmit,
    handleOpenCreateDialog,
    handleCloseCreateDialog,
    isCreatePending,
  } = useGroupsListStore();

  // Priority state rendering mapping array memoized with useMemo
  const activeContentState = useMemo(() => {
    return [
      {
        condition: isPending,
        render: () => (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={44} />
          </Box>
        ),
      },
      {
        condition: Boolean(error),
        render: () => (
          <Alert intent="error" title={t('groups.errorAlertTitle') || t('common.error')}>
            {error?.message || t('groups.loadFailed')}
          </Alert>
        ),
      },
      {
        condition: filteredGroups.length === 0,
        render: () => (
          <GroupsListEmptyState
            isFiltered={isFiltered}
            onClearFilters={handleClearFilters}
            onCreateGroup={handleOpenCreateDialog}
          />
        ),
      },
      {
        condition: true,
        render: () => (
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
        ),
      },
    ].find((state) => state.condition);
  }, [
    isPending,
    error,
    filteredGroups,
    isFiltered,
    handleClearFilters,
    handleOpenCreateDialog,
    handleNavigateDetail,
    t,
  ]);

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
          {t('groups.createBtn') || t('groups.createGroup')}
        </Button>
      </Box>

      {/* Multi-facet Filter Bar (Keyword, Category, Creator) */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 2,
          boxShadow: 2,
        }}
      >
        {/* Keyword Search */}
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
          sx={{ flex: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />

        {/* Category Filter Dropdown */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 }, flex: 1 }}>
          <Select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value as number | 'ALL')}
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon fontSize="small" color="action" />
              </InputAdornment>
            }
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="ALL">
              <em>{t('groups.allCategories')}</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Creator Filter Dropdown */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 }, flex: 1 }}>
          <Select
            value={selectedCreatorId}
            onChange={(e) => setSelectedCreatorId(e.target.value as number | 'ALL')}
            startAdornment={
              <InputAdornment position="start">
                <PersonIcon fontSize="small" color="action" />
              </InputAdornment>
            }
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="ALL">
              <em>{t('groups.allCreators')}</em>
            </MenuItem>
            {uniqueCreators.map((creator) => (
              <MenuItem key={creator.id} value={creator.id}>
                @{creator.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reset / Clear Filters Button */}
        {isFiltered && (
          <Tooltip title={t('groups.clearFilters')}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleClearFilters}
              startIcon={<FilterAltOffIcon />}
              sx={{ borderRadius: 3, py: 0.8, px: 2, whiteSpace: 'nowrap' }}
            >
              {t('groups.clearFilters')}
            </Button>
          </Tooltip>
        )}
      </Paper>

      {/* Dynamic Content (Loading / Error / Empty / Grid) */}
      {activeContentState?.render()}

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
