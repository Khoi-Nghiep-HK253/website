import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ShowChart as ShowChartIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import type { SystemStats } from '@/services/userService';

interface SystemStatsCardProps {
  stats: SystemStats | undefined;
  isPending: boolean;
  isFetching: boolean;
  dataUpdatedAt: number;
  onRefetch: () => void;
}

export function SystemStatsCard({
  stats,
  isPending,
  isFetching,
  dataUpdatedAt,
  onRefetch,
}: SystemStatsCardProps) {
  return (
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShowChartIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            TanStack Query Stats
          </Typography>
        </Box>
        {isFetching && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption" color="text.secondary">
              Syncing...
            </Typography>
          </Box>
        )}
      </Box>

      {isPending ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3, justifyContent: 'center' }}>
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">
            Đang tải dữ liệu từ API...
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
            {stats?.activeUsers} Active Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Tổng Requests:</strong> {stats?.totalRequests.toLocaleString('vi-VN')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Server Uptime:</strong> {stats?.serverUptime}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cập nhật lần cuối: {new Date(dataUpdatedAt).toLocaleTimeString('vi-VN')}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRefetch}
              disabled={isFetching}
            >
              Refetch Cache
            </Button>
          </Box>
        </>
      )}
    </Card>
  );
}
