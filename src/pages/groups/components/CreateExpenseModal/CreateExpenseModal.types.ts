import type { CurrencyResponse } from '@/services/currencyService';
import type { GroupMemberResponse } from '@/services/groupService';
import type { CreateExpensePayload } from '@/services/expenseService';

export interface PayerEntry {
  userId: number;
  amount: number;
}

export interface ShareEntry {
  userId: number;
  amount?: number;
  percentage?: number;
  ratio?: number;
  adjustment?: number;
}

export interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
  currencies: CurrencyResponse[];
  members: GroupMemberResponse[];
  currentUserId?: number;
  onSubmit: (payload: CreateExpensePayload) => void;
  isPending: boolean;
}
