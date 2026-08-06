import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMyGroups, useCreateGroupMutation } from '@/hooks/query/useGroupQuery';
import { useCategories } from '@/hooks/query/useMasterQuery';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { useToast } from '@/hooks/common/useToast';
import { PATHS } from '@/router/routes';

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

  return {
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
    isCreatePending: createGroupMutation.isPending,
  };
}
