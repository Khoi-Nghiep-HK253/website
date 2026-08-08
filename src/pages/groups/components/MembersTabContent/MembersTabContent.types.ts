import type { GroupMemberResponse } from '@/services/groupService';

export interface MembersTabContentProps {
  members: GroupMemberResponse[];
  onOpenAddMemberModal: () => void;
  onOpenShareLinkModal?: () => void;
  onRemoveMember: (memberId: number) => void;
  isOwner?: boolean;
}
