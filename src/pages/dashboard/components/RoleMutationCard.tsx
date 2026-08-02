import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Person as PersonIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface RoleMutationCardProps {
  currentRole: string;
  isMutating: boolean;
  isSuccess: boolean;
  onRoleChange: (role: string) => void;
}

export function RoleMutationCard({
  currentRole,
  isMutating,
  isSuccess,
  onRoleChange,
}: RoleMutationCardProps) {
  return (
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="success" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            TanStack Mutation Demo
          </Typography>
        </Box>
        {isMutating && <CircularProgress size={20} />}
      </Box>

      <Typography variant="body2" color="text.secondary">
        Thực thi `useMutation` để cập nhật vai trò người dùng và tự động invalidate cache `systemStats`.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Button
          size="small"
          variant={currentRole === 'Developer' ? 'contained' : 'outlined'}
          onClick={() => onRoleChange('Developer')}
          disabled={isMutating}
        >
          Developer
        </Button>
        <Button
          size="small"
          variant={currentRole === 'Admin' ? 'contained' : 'outlined'}
          onClick={() => onRoleChange('Admin')}
          disabled={isMutating}
        >
          Admin
        </Button>
        <Button
          size="small"
          variant={currentRole === 'Tech Lead' ? 'contained' : 'outlined'}
          onClick={() => onRoleChange('Tech Lead')}
          disabled={isMutating}
        >
          Tech Lead
        </Button>
      </Box>

      {isSuccess && (
        <Box sx={{ mt: 1 }}>
          <Chip
            color="success"
            variant="outlined"
            icon={<CheckCircleIcon />}
            label="Cập nhật thành công & Invalidated Query Cache!"
            size="small"
          />
        </Box>
      )}
    </Card>
  );
}
