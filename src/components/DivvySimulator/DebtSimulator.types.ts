export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  paid: number;
  share: number;
}

export interface CalculatedDebt {
  id: string;
  fromName: string;
  toName: string;
  amount: number;
  status: 'PENDING' | 'SETTLED';
}

export interface DebtSimulatorProps {
  initialDescription?: string;
  initialTotalAmount?: number;
  initialMembers?: Member[];
}
