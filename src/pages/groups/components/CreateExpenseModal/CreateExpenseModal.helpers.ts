import type { GroupMemberResponse } from '@/services/groupService';
import { SPLIT_TYPE_VALUE, type SplitType } from '@/constants';
import type { ShareEntry } from './CreateExpenseModal.types';

export const getMemberUsername = (m: GroupMemberResponse): string =>
  m.user?.username || m.username || `User #${m.userId || m.id}`;

export const getMemberDisplayName = (m: GroupMemberResponse): string => {
  const uname = getMemberUsername(m);
  const fname = m.user?.firstname || m.firstname;
  const lname = m.user?.lastname || m.lastname;
  return fname ? `${uname} (${fname} ${lname || ''})`.trim() : uname;
};

export const getMemberUserId = (m: GroupMemberResponse): number =>
  m.user?.id || m.userId || m.id;

export function previewShares(
  splitType: SplitType,
  totalAmount: number,
  shareEntries: ShareEntry[]
): Map<number, number> {
  const result = new Map<number, number>();
  const count = shareEntries.length;
  if (count === 0) return result;

  switch (splitType) {
    case SPLIT_TYPE_VALUE.EQUAL: {
      const equal = Math.floor((totalAmount / count) * 100) / 100;
      const remainder = Math.round((totalAmount - equal * count) * 100) / 100;
      shareEntries.forEach((e, i) => result.set(e.userId, i === 0 ? equal + remainder : equal));
      break;
    }
    case SPLIT_TYPE_VALUE.EXACT: {
      shareEntries.forEach((e) => result.set(e.userId, e.amount ?? 0));
      break;
    }
    case SPLIT_TYPE_VALUE.PERCENTAGE: {
      shareEntries.forEach((e) => {
        const amt = Math.round(totalAmount * (e.percentage ?? 0)) / 100;
        result.set(e.userId, amt);
      });
      break;
    }
    case SPLIT_TYPE_VALUE.SHARES: {
      const totalRatio = shareEntries.reduce((sum, e) => sum + (e.ratio ?? 0), 0);
      if (totalRatio > 0) {
        shareEntries.forEach((e) => {
          const amt = Math.round(((totalAmount * (e.ratio ?? 0)) / totalRatio) * 100) / 100;
          result.set(e.userId, amt);
        });
      }
      break;
    }
    case SPLIT_TYPE_VALUE.ADJUSTMENT: {
      const base = Math.floor((totalAmount / count) * 100) / 100;
      const baseRemainder = Math.round((totalAmount - base * count) * 100) / 100;
      shareEntries.forEach((e, i) => {
        const adj = e.adjustment ?? 0;
        result.set(e.userId, base + adj + (i === 0 ? baseRemainder : 0));
      });
      break;
    }
  }
  return result;
}
