import { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import {
  ArrowBack as ArrowBackIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
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
import type { CreateExpensePayload } from '@/services/expenseService';
import type { CreateSettlementPayload } from '@/services/settlementService';
import { useAuth } from '@/hooks/common';
import { PATHS } from '@/router/routes';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { Alert, CustomTabPanel } from '@/components';
import {
  ExpenseTabContent,
  DebtsTabContent,
  MembersTabContent,
  SettlementsTabContent,
  CreateExpenseModal,
  AddMemberModal,
  RecordSettlementModal,
  ExpenseDetailModal,
  GroupShareLinkModal,
} from './components';

export default function GroupDetailPage() {
  const { t } = useTranslation();
  const { groupId: groupIdStr } = useParams<{ groupId: string }>();
  const groupId = Number(groupIdStr);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(0);

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

  // Modals state
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [openShareLinkModal, setOpenShareLinkModal] = useState(false);
  const [openSettleModal, setOpenSettleModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const [selectedDebtId, setSelectedDebtId] = useState<number | null>(null);
  const [selectedDebtAmount, setSelectedDebtAmount] = useState<number>(0);

  const expensesList = useMemo(() => expensesData?.content || [], [expensesData]);
  const settlementsList = useMemo(() => settlementsData?.content || [], [settlementsData]);

  const currentUserMember = useMemo(
    () => members.find((m) => m.user?.id === user?.id || m.userId === user?.id),
    [members, user?.id]
  );
  const isOwner = currentUserMember?.role === 'OWNER';

  const handleCreateExpenseSubmit = useCallback(
    (payload: CreateExpensePayload) => {
      createExpenseMutation.mutate(
        { groupId, payload },
        {
          onSuccess: () => {
            setOpenExpenseModal(false);
            showSuccess(t('groupDetail.createExpenseSuccess'));
          },
          onError: (err: Error) => {
            showError(`${t('groupDetail.createExpenseFailed')}: ${err.message || ''}`);
          },
        }
      );
    },
    [createExpenseMutation, groupId, showError, showSuccess, t]
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
            setOpenMemberModal(false);
            showSuccess(t('groupDetail.sendInviteSuccess'));
          },
          onError: (err: Error) => {
            showError(`${t('groupDetail.sendInviteFailed')}: ${err.message || ''}`);
          },
        }
      );
    },
    [groupId, sendInvitationMutation, showError, showSuccess, t]
  );

  const handleOpenSettleModal = useCallback((debtId: number, amount: number) => {
    setSelectedDebtId(debtId);
    setSelectedDebtAmount(amount);
    setOpenSettleModal(true);
  }, []);

  const handleOpenExpenseDetail = useCallback((expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setOpenDetailModal(true);
  }, []);

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
    (payload: CreateSettlementPayload) => {
      createSettlementMutation.mutate(
        { groupId, payload },
        {
          onSuccess: () => {
            setOpenSettleModal(false);
            setSelectedDebtId(null);
            showSuccess(t('groupDetail.recordSettlementSuccess'));
          },
          onError: (err: Error) => {
            showError(`${t('groupDetail.recordSettlementFailed')}: ${err.message || ''}`);
          },
        }
      );
    },
    [createSettlementMutation, groupId, showError, showSuccess, t]
  );

  const handleBackToList = useCallback(() => {
    navigate(PATHS.GROUPS.LIST);
  }, [navigate]);

  if (isGroupPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={44} />
      </Box>
    );
  }

  if (groupError || !group) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert intent="error" title={t('groupDetail.groupNotFound')}>
          {groupError?.message || t('groupDetail.groupNotFoundSub')}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackToList} sx={{ mt: 2 }}>
          {t('groupDetail.backToList')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackToList} color="inherit">
          {t('groupDetail.backToList')}
        </Button>
      </Box>

      {/* Group Detail Card */}
      <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, boxShadow: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <GroupIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                {group.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {group.note || t('groups.noNote')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenExpenseModal(true)}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('groupDetail.addExpenseBtn')}
          </Button>

          {isOwner && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => setOpenMemberModal(true)}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              {t('groupDetail.inviteMemberBtn')}
            </Button>
          )}
        </Box>
      </Card>

      {/* Tabs Navigation */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            color="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab icon={<ReceiptLongIcon />} label={t('groupDetail.tabExpenses')} iconPosition="start" />
            <Tab icon={<AccountBalanceIcon />} label={t('groupDetail.tabDebts')} iconPosition="start" />
            <Tab icon={<GroupIcon />} label={t('groupDetail.tabMembers')} iconPosition="start" />
            <Tab icon={<PaymentsIcon />} label={t('groupDetail.tabSettlements')} iconPosition="start" />
          </Tabs>
        </Box>

        {/* TAB 1: KHOẢN CHI (EXPENSES) */}
        <CustomTabPanel value={activeTab} index={0}>
          <ExpenseTabContent
            expenses={expensesList}
            onOpenCreateModal={() => setOpenExpenseModal(true)}
            onSelectExpense={handleOpenExpenseDetail}
            onDeleteExpense={handleDeleteExpense}
          />
        </CustomTabPanel>

        {/* TAB 2: BẢNG CÔNG NỢ (DEBTS) */}
        <CustomTabPanel value={activeTab} index={1}>
          <DebtsTabContent
            debtsSummary={debtsSummary}
            myDebts={myDebts}
            onOpenSettleModal={handleOpenSettleModal}
          />
        </CustomTabPanel>

        {/* TAB 3: THÀNH VIÊN (MEMBERS) */}
        <CustomTabPanel value={activeTab} index={2}>
          <MembersTabContent
            members={members}
            onOpenAddMemberModal={() => setOpenMemberModal(true)}
            onOpenShareLinkModal={() => setOpenShareLinkModal(true)}
            onRemoveMember={handleRemoveMember}
            isOwner={isOwner}
          />
        </CustomTabPanel>

        {/* TAB 4: LỊCH SỬ THÀNH TOÁN (SETTLEMENTS) */}
        <CustomTabPanel value={activeTab} index={3}>
          <SettlementsTabContent settlements={settlementsList} />
        </CustomTabPanel>
      </Paper>

      {/* Modals */}
      <CreateExpenseModal
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
        currencies={currencies}
        members={members}
        currentUserId={user?.id}
        onSubmit={handleCreateExpenseSubmit}
        isPending={createExpenseMutation.isPending}
      />

      <AddMemberModal
        open={openMemberModal}
        onClose={() => setOpenMemberModal(false)}
        onSubmit={handleAddMemberSubmit}
        isPending={sendInvitationMutation.isPending}
        existingMembers={members}
      />

      <RecordSettlementModal
        open={openSettleModal}
        onClose={() => setOpenSettleModal(false)}
        debtId={selectedDebtId}
        defaultAmount={selectedDebtAmount}
        onSubmit={handleSettleSubmit}
        isPending={createSettlementMutation.isPending}
      />

      <ExpenseDetailModal
        open={openDetailModal}
        onClose={() => {
          setOpenDetailModal(false);
          setSelectedExpenseId(null);
        }}
        groupId={groupId}
        expenseId={selectedExpenseId}
      />

      <GroupShareLinkModal
        open={openShareLinkModal}
        onClose={() => setOpenShareLinkModal(false)}
        groupId={groupId}
        isOwner={isOwner}
      />
    </Box>
  );
}
