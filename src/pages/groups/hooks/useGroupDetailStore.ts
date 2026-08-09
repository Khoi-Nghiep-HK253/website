import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useGroupDetail,
  useGroupMembers,
  useRemoveMemberMutation,
} from '@/hooks/query/useGroupQuery';
import {
  useGroupExpenses,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} from '@/hooks/query/useExpenseQuery';
import {
  useGroupDebtSummary,
  useMyDebts,
} from '@/hooks/query/useDebtQuery';
import {
  useGroupSettlements,
  useCreateSettlementMutation,
} from '@/hooks/query/useSettlementQuery';
import { useCurrencies } from '@/hooks/query/useMasterQuery';
import { useSendInvitationMutation } from '@/hooks/query/useInvitationQuery';
import { useToast } from '@/hooks/common/useToast';
import { useAuth } from '@/hooks/common';
import { PATHS } from '@/constants/routes';
import { mediaService } from '@/services/mediaService';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import type { CreateExpensePayload } from '@/services/expenseService';
import type { CreateSettlementPayload } from '@/services/settlementService';

export type ActiveModalType =
  | 'CREATE_EXPENSE'
  | 'ADD_MEMBER'
  | 'SHARE_LINK'
  | 'RECORD_SETTLEMENT'
  | 'EXPENSE_DETAIL'
  | null;

export function useGroupDetailStore(groupId: number) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(0);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const [selectedDebtId, setSelectedDebtId] = useState<number | null>(null);
  const [selectedDebtAmount, setSelectedDebtAmount] = useState<number>(0);

  // Queries
  const { data: group, isPending: isGroupPending, error: groupError } = useGroupDetail(groupId);
  useDocumentTitle(group?.name ? `${group.name}` : t('groups.title'));

  const { data: members = [] } = useGroupMembers(groupId);
  const { data: currencies = [] } = useCurrencies();
  const { data: expensesData } = useGroupExpenses(groupId);
  const { data: debtsSummary } = useGroupDebtSummary(groupId);
  const { data: myDebts } = useMyDebts(groupId);
  const { data: settlementsData } = useGroupSettlements(groupId);

  // Mutations
  const createExpenseMutation = useCreateExpenseMutation();
  const deleteExpenseMutation = useDeleteExpenseMutation();
  const removeMemberMutation = useRemoveMemberMutation();
  const createSettlementMutation = useCreateSettlementMutation();
  const sendInvitationMutation = useSendInvitationMutation();

  // Derived values
  const expensesList = useMemo(() => expensesData?.content || [], [expensesData]);
  const settlementsList = useMemo(() => settlementsData?.content || [], [settlementsData]);

  const currentUserMember = useMemo(
    () => members.find((m) => m.user?.id === user?.id || m.userId === user?.id),
    [members, user?.id]
  );
  const isOwner = currentUserMember?.role === 'OWNER';

  // Modal Handlers
  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const openModal = useCallback((type: ActiveModalType) => {
    setActiveModal(type);
  }, []);

  const handleOpenExpenseDetail = useCallback((expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setActiveModal('EXPENSE_DETAIL');
  }, []);

  const handleCloseExpenseDetail = useCallback(() => {
    setActiveModal(null);
    setSelectedExpenseId(null);
  }, []);

  const handleOpenSettleModal = useCallback((debtId: number, amount: number) => {
    setSelectedDebtId(debtId);
    setSelectedDebtAmount(amount);
    setActiveModal('RECORD_SETTLEMENT');
  }, []);

  const handleBackToList = useCallback(() => {
    navigate(PATHS.GROUPS.LIST);
  }, [navigate]);

  // Submit Handlers
  const handleCreateExpenseSubmit = useCallback(
    async (payload: CreateExpensePayload, files?: File[]) => {
      try {
        const newExpense = await createExpenseMutation.mutateAsync({ groupId, payload });
        if (files && files.length > 0) {
          await Promise.all(
            files.map((file) =>
              mediaService.uploadMedia(file, 'EXPENSE', newExpense.id).catch((uploadErr) => {
                console.error('Failed to upload expense receipt image:', uploadErr);
              })
            )
          );
        }
        closeModal();
        showSuccess(t('groupDetail.createExpenseSuccess'));
      } catch (err: any) {
        showError(`${t('groupDetail.createExpenseFailed')}: ${err?.message || ''}`);
      }
    },
    [createExpenseMutation, groupId, closeModal, showError, showSuccess, t]
  );

  const handleAddMemberSubmit = useCallback(
    (payload: { userId: number; message?: string; expiresAt?: string }) => {
      sendInvitationMutation.mutate(
        {
          groupId,
          payload: {
            inviteeId: payload.userId,
            message: payload.message,
            expiresAt: payload.expiresAt,
          },
        },
        {
          onSuccess: () => {
            closeModal();
            showSuccess(t('groupDetail.sendInviteSuccess'));
          },
          onError: (err: Error) => {
            showError(`${t('groupDetail.sendInviteFailed')}: ${err.message || ''}`);
          },
        }
      );
    },
    [groupId, sendInvitationMutation, closeModal, showError, showSuccess, t]
  );

  const handleDeleteExpense = useCallback(
    (expenseId: number) => {
      deleteExpenseMutation.mutate(
        { groupId, expenseId },
        {
          onSuccess: () => {
            showSuccess(t('groupDetail.deleteExpenseSuccess'));
          },
          onError: (err: Error) => {
            showError(`${t('groupDetail.deleteExpenseFailed')}: ${err.message || ''}`);
          },
        }
      );
    },
    [deleteExpenseMutation, groupId, showError, showSuccess, t]
  );

  const handleRemoveMember = useCallback(
    (memberId: number) => {
      removeMemberMutation.mutate(
        { groupId, memberId },
        {
          onSuccess: () => {
            showSuccess(t('groupDetail.removeMemberSuccess'));
          },
          onError: (err: Error) => {
            showError(`${t('groupDetail.removeMemberFailed')}: ${err.message || ''}`);
          },
        }
      );
    },
    [groupId, removeMemberMutation, showError, showSuccess, t]
  );

  const handleSettleSubmit = useCallback(
    async (payload: CreateSettlementPayload, files?: File[]) => {
      try {
        const newSettlement = await createSettlementMutation.mutateAsync({ groupId, payload });
        if (files && files.length > 0) {
          await Promise.all(
            files.map((file) =>
              mediaService.uploadMedia(file, 'SETTLEMENT', newSettlement.id).catch((uploadErr) => {
                console.error('Failed to upload settlement proof image:', uploadErr);
              })
            )
          );
        }
        closeModal();
        setSelectedDebtId(null);
        showSuccess(t('groupDetail.recordSettlementSuccess'));
      } catch (err: any) {
        showError(`${t('groupDetail.recordSettlementFailed')}: ${err?.message || ''}`);
      }
    },
    [createSettlementMutation, groupId, closeModal, showError, showSuccess, t]
  );

  return {
    t,
    groupId,
    group,
    isGroupPending,
    groupError,
    members,
    currencies,
    expensesList,
    settlementsList,
    debtsSummary,
    myDebts,
    isOwner,
    user,
    activeTab,
    setActiveTab,
    activeModal,
    openModal,
    closeModal,
    selectedExpenseId,
    selectedDebtId,
    selectedDebtAmount,
    handleBackToList,
    handleCreateExpenseSubmit,
    handleAddMemberSubmit,
    handleOpenExpenseDetail,
    handleCloseExpenseDetail,
    handleOpenSettleModal,
    handleDeleteExpense,
    handleRemoveMember,
    handleSettleSubmit,
    isCreateExpensePending: createExpenseMutation.isPending,
    isSendInvitePending: sendInvitationMutation.isPending,
    isSettlePending: createSettlementMutation.isPending,
  };
}
