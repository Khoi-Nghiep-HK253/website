import type { GroupMemberResponse } from '@/services/groupService';

export const getMemberUsername = (m: GroupMemberResponse): string => {
  return m.user?.username || m.username || (m.userId ? `User #${m.userId}` : 'Member');
};

export const getMemberInitial = (m: GroupMemberResponse): string => {
  const uname = getMemberUsername(m);
  return (uname && uname.length > 0 ? uname.charAt(0) : 'M').toUpperCase();
};

export const getMemberDisplayName = (m: GroupMemberResponse): string => {
  const uname = getMemberUsername(m);
  const fname = m.user?.firstname || m.firstname;
  const lname = m.user?.lastname || m.lastname;
  if (fname) {
    return `${uname} (${fname} ${lname || ''})`.trim();
  }
  return uname;
};
