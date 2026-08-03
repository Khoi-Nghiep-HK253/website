import { useState } from 'react';
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
import {
  useGroupDetail,
  useGroupMembers,
  useRemoveMemberMutation,
} from '@/hooks/useGroupQuery';
import {
  useGroupExpenses,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} from '@/hooks/useExpenseQuery';
import {
  useGroupDebtSummary,
  useMyDebts,
} from '@/hooks/useDebtQuery';
import {
  useGroupSettlements,
  useCreateSettlementMutation,
} from '@/hooks/useSettlementQuery';
import { useCurrencies } from '@/hooks/useMasterQuery';
import { useSendInvitationMutation } from '@/hooks/useInvitationQuery';
import { useToast } from '@/context/ToastContext';
import type { CreateExpensePayload } from '@/services/expenseService';
import type { CreateSettlementPayload } from '@/services/settlementService';
import { useAuth } from '@/context/AuthContext';
import { PATHS } from '@/router/routes';
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
} from './components';

export default function GroupDetailPage() {
  const { groupId: groupIdStr } = useParams<{ groupId: string }>();
  const groupId = Number(groupIdStr);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(0);

  // Queries
  const { data: group, isPending: isGroupPending, error: groupError } = useGroupDetail(groupId);
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
  const [openSettleModal, setOpenSettleModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const [selectedDebtId, setSelectedDebtId] = useState<number | null>(null);
  const [selectedDebtAmount, setSelectedDebtAmount] = useState<number>(0);

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
        <Alert intent="error" title="Không tìm thấy nhóm">
          {groupError?.message || 'Nhóm không tồn tại hoặc bạn chưa có quyền truy cập.'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(PATHS.GROUPS)} sx={{ mt: 2 }}>
          Quay lại Danh sách Nhóm
        </Button>
      </Box>
    );
  }

  const handleCreateExpenseSubmit = (payload: CreateExpensePayload) => {
    createExpenseMutation.mutate(
      { groupId, payload },
      {
        onSuccess: () => {
          setOpenExpenseModal(false);
          showSuccess('Tạo khoản chi mới thành công!');
        },
        onError: (err: any) => {
          showError(`Tạo khoản chi thất bại: ${err.message || 'Vui lòng thử lại'}`);
        },
      }
    );
  };

  const handleAddMemberSubmit = (payload: { userId: number; message?: string; expiresAt?: string }) => {
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
          showSuccess('Đã gửi lời mời vào nhóm thành công! Vui lòng chờ người dùng chấp nhận.');
        },
        onError: (err: any) => {
          showError(`Gửi lời mời thất bại: ${err.message || 'Người dùng đã có lời mời chờ xử lý hoặc đã ở trong nhóm'}`);
        },
      }
    );
  };

  const handleOpenSettleModal = (debtId: number, amount: number) => {
    setSelectedDebtId(debtId);
    setSelectedDebtAmount(amount);
    setOpenSettleModal(true);
  };

  const handleOpenExpenseDetail = (expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setOpenDetailModal(true);
  };

  const handleDeleteExpense = (expenseId: number) => {
    deleteExpenseMutation.mutate(
      { groupId, expenseId },
      {
        onSuccess: () => {
          showSuccess('Xóa khoản chi thành công!');
        },
        onError: (err: any) => {
          showError(`Xóa khoản chi thất bại: ${err.message || 'Bạn không có quyền hoặc khoản chi không tồn tại'}`);
        },
      }
    );
  };

  const handleRemoveMember = (memberId: number) => {
    removeMemberMutation.mutate(
      { groupId, memberId },
      {
        onSuccess: () => {
          showSuccess('Đã xóa thành viên khỏi nhóm!');
        },
        onError: (err: any) => {
          showError(`Xóa thành viên thất bại: ${err.message || 'Vui lòng thử lại'}`);
        },
      }
    );
  };

  const handleSettleSubmit = (payload: CreateSettlementPayload) => {
    createSettlementMutation.mutate(
      { groupId, payload },
      {
        onSuccess: () => {
          setOpenSettleModal(false);
          setSelectedDebtId(null);
          showSuccess('Ghi nhận thanh toán thành công!');
        },
        onError: (err: any) => {
          showError(`Ghi nhận thanh toán thất bại: ${err.message || 'Vui lòng thử lại'}`);
        },
      }
    );
  };

  const expensesList = expensesData?.content || [];
  const settlementsList = settlementsData?.content || [];

  const currentUserMember = members.find(
    (m) =>
      (user?.id && m.userId === user.id) ||
      (user?.username && (m.username === user.username || m.user?.username === user.username)) ||
      (user?.email && (m.email === user.email || m.user?.email === user.email))
  );
  const isOwner = currentUserMember?.role === 'OWNER';

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(PATHS.GROUPS)} color="inherit">
          Trở về Danh sách
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
                {group.note || 'Không có ghi chú.'}
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
            Thêm Khoản Chi Mới
          </Button>

          {isOwner && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => setOpenMemberModal(true)}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              Mời Thành Viên
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
            <Tab icon={<ReceiptLongIcon />} label="Khoản Chi (Expenses)" iconPosition="start" />
            <Tab icon={<AccountBalanceIcon />} label="Công Nợ (Debts)" iconPosition="start" />
            <Tab icon={<GroupIcon />} label="Thành Viên (Members)" iconPosition="start" />
            <Tab icon={<PaymentsIcon />} label="Lịch Sử Thanh Toán" iconPosition="start" />
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
    </Box>
  );
}
