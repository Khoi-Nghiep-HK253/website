import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  ArrowBack as ArrowBackIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Alert, CustomTabPanel } from '@/components';
import { useGroupDetailStore } from './hooks/useGroupDetailStore';
import {
  GroupDetailHeader,
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
  const { groupId: groupIdStr } = useParams<{ groupId: string }>();
  const groupId = Number(groupIdStr);

  const {
    t,
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
    isCreateExpensePending,
    isSendInvitePending,
    isSettlePending,
  } = useGroupDetailStore(groupId);

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
      {/* Group Detail Header */}
      <GroupDetailHeader
        group={group}
        isOwner={isOwner}
        onBackToList={handleBackToList}
        onOpenCreateExpense={() => openModal('CREATE_EXPENSE')}
        onOpenAddMember={() => openModal('ADD_MEMBER')}
      />

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
            onOpenCreateModal={() => openModal('CREATE_EXPENSE')}
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
            onOpenAddMemberModal={() => openModal('ADD_MEMBER')}
            onOpenShareLinkModal={() => openModal('SHARE_LINK')}
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
        open={activeModal === 'CREATE_EXPENSE'}
        onClose={closeModal}
        currencies={currencies}
        members={members}
        currentUserId={user?.id}
        onSubmit={handleCreateExpenseSubmit}
        isPending={isCreateExpensePending}
      />

      <AddMemberModal
        open={activeModal === 'ADD_MEMBER'}
        onClose={closeModal}
        onSubmit={handleAddMemberSubmit}
        isPending={isSendInvitePending}
        existingMembers={members}
      />

      <RecordSettlementModal
        open={activeModal === 'RECORD_SETTLEMENT'}
        onClose={closeModal}
        debtId={selectedDebtId}
        defaultAmount={selectedDebtAmount}
        onSubmit={handleSettleSubmit}
        isPending={isSettlePending}
      />

      <ExpenseDetailModal
        open={activeModal === 'EXPENSE_DETAIL'}
        onClose={handleCloseExpenseDetail}
        groupId={groupId}
        expenseId={selectedExpenseId}
      />

      <GroupShareLinkModal
        open={activeModal === 'SHARE_LINK'}
        onClose={closeModal}
        groupId={groupId}
        isOwner={isOwner}
      />
    </Box>
  );
}
