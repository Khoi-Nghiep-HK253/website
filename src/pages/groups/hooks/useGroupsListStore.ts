import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMyGroups, useCreateGroupMutation } from '@/hooks/query/useGroupQuery';
import { useCategories } from '@/hooks/query/useMasterQuery';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { useToast } from '@/hooks/common/useToast';
import { PATHS } from '@/constants/routes';

export function useGroupsListStore() {
  const { t } = useTranslation();
  useDocumentTitle(t('groups.title'));
  const navigate = useNavigate();

  const { data: myGroupsData, isPending, error } = useMyGroups();
  const { data: categories = [] } = useCategories();
  const createGroupMutation = useCreateGroupMutation();
  const { showSuccess, showError } = useToast();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'ALL'>('ALL');
  const [selectedCreatorId, setSelectedCreatorId] = useState<number | 'ALL'>('ALL');

  const groupsList = useMemo(() => {
    return myGroupsData?.content || [];
  }, [myGroupsData]);

  // Extract unique creators from groupsList for filter dropdown
  const uniqueCreators = useMemo(() => {
    const map = new Map<number, { id: number; username: string }>();
    groupsList.forEach((g) => {
      if (g.createdBy?.id && g.createdBy?.username) {
        map.set(g.createdBy.id, g.createdBy);
      }
    });
    return Array.from(map.values());
  }, [groupsList]);

  // Multi-facet filtering logic
  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return groupsList.filter((g) => {
      // 1. Keyword search (Name, Note, Creator username, Category name)
      const categoryName = g.category?.name || g.categoryName || '';
      const creatorName = g.createdBy?.username || '';
      const matchesQuery =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.note && g.note.toLowerCase().includes(q)) ||
        creatorName.toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q);

      // 2. Category filter
      const groupCatId = g.categoryId || g.category?.id;
      const matchesCategory =
        selectedCategoryId === 'ALL' || groupCatId === selectedCategoryId;

      // 3. Creator filter
      const groupCreatorId = g.createdBy?.id;
      const matchesCreator =
        selectedCreatorId === 'ALL' || groupCreatorId === selectedCreatorId;

      return matchesQuery && matchesCategory && matchesCreator;
    });
  }, [groupsList, searchQuery, selectedCategoryId, selectedCreatorId]);

  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategoryId !== 'ALL' ||
      selectedCreatorId !== 'ALL'
    );
  }, [searchQuery, selectedCategoryId, selectedCreatorId]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategoryId('ALL');
    setSelectedCreatorId('ALL');
  }, []);

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

  return {
    t,
    isPending,
    error,
    categories,
    uniqueCreators,
    groupsList,
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
    isCreatePending: createGroupMutation.isPending,
  };
}
