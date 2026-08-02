import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import {
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalance as AccountBalanceIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  FlightTakeoff as FlightTakeoffIcon,
  HomeWork as HomeWorkIcon,
  SportsSoccer as SportsSoccerIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/router/routes';
import { useAuth } from '@/context/AuthContext';
import { DebtSimulator } from '@/components/DivvySimulator/DebtSimulator';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* ── HERO BANNER SECTION ────────────────────────────────────────────── */}
      <Card
        sx={{
          p: { xs: 3, md: 6 },
          textAlign: 'center',
          borderRadius: 5,
          boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'primary.light',
        }}
      >
        <Chip
          icon={<StarIcon sx={{ color: '#f59e0b !important' }} />}
          label="Ứng dụng quản lý chi tiêu nhóm minh bạch #1"
          color="primary"
          variant="outlined"
          sx={{ mb: 2, fontWeight: 700, px: 1, py: 0.5 }}
        />

        <Typography variant="h2" component="h1" color="primary.main" sx={{ fontSize: { xs: '2rem', md: '3.25rem' }, mb: 2, fontWeight: 800 }}>
          Divvy – Sổ Quỹ Thông Minh Cho Mọi Nhóm Bạn & Gia Đình
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4, fontWeight: 400, lineHeight: 1.6 }}
        >
          Quản lý chi tiêu chung một cách <strong>minh bạch, tự động và tiện lợi</strong>. Tự động cấn trừ công nợ giữa các
          thành viên, xóa bỏ nhầm lẫn và dẹp tan tranh cãi tiền bạc sau mỗi chuyến du lịch, ăn uống hay sinh hoạt nhóm.
        </Typography>

        {isAuthenticated && (
          <Box sx={{ mb: 3 }}>
            <Chip
              icon={<CheckCircleIcon color="success" />}
              label={`Xin chào ${user?.username || user?.email}! Bạn đã sẵn sàng quản lý nhóm.`}
              color="success"
              variant="outlined"
              sx={{ fontWeight: 'bold', fontSize: '0.95rem', py: 2, px: 1 }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(PATHS.GROUPS)}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
          >
            {isAuthenticated ? 'Vào Danh Sách Nhóm' : 'Khám Phá Các Nhóm Chi Tiêu'}
          </Button>

          {!isAuthenticated && (
            <Button
              variant="outlined"
              size="large"
              color="primary"
              onClick={() => navigate(PATHS.REGISTER)}
              sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
            >
              Đăng Ký Tài Khoản Miễn Phí
            </Button>
          )}
        </Box>

        {/* Feature Highlights Tags */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
            gap: 2,
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <FlightTakeoffIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Du Lịch & Dã Ngoại
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <HomeWorkIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Ở Chung Nhà / Phòng Trọ
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <SportsSoccerIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Nhóm Đá Bóng & CLB
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <WorkIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Dự Án & Làm Việc
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* ── CORE ENTITIES & FEATURES SHOWCASE ────────────────────────────── */}
      <Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip label="Kiến trúc hệ thống minh bạch" color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            Các Thành Phần Cốt Lõi Tạo Nên Divvy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Dữ liệu được tổ chức chặt chẽ giúp bạn dễ dàng theo dõi từ khoản chi nhỏ nhất đến tổng công nợ nhóm.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', mb: 2 }}>
              <GroupIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              1. Quản Lý Nhóm (Groups)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tạo nhóm theo chủ đề (Du lịch, Trọ, Thể thao...). Đặt loại tiền tệ mặc định (VND, USD...), ghi chú và khoảng
              thời gian hoạt động.
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', mb: 2 }}>
              <PersonAddIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              2. Thành Viên & Lời Mời
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mời bạn bè qua đường dẫn hoặc mã token có thời hạn. Phân quyền Admin / Thành viên linh hoạt.
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'info.light', color: 'info.contrastText', mb: 2 }}>
              <ReceiptLongIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              3. Khoản Chi Multi-Payer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ghi nhận 1 hoặc nhiều người cùng đứng ra trả tiền trước. Chọn chính xác danh sách những ai tham gia chia tiền.
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.contrastText', mb: 2 }}>
              <AccountBalanceIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              4. Tự Động Tính Công Nợ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thuật toán tự động cấn trừ giữa tiền đã ứng trước và tiền phải chịu để đưa ra danh sách "Ai nợ Ai bao nhiêu".
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'success.light', color: 'success.contrastText', mb: 2 }}>
              <CheckCircleIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              5. Thanh Toán Trả Nợ (Settlement)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ghi nhận giao dịch trả nợ qua tiền mặt hoặc chuyển khoản. Cập nhật trạng thái công nợ ngay khi hoàn tất.
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'error.light', color: 'error.contrastText', mb: 2 }}>
              <HistoryIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              6. Nhật Ký Lịch Sử (Activity Log)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sổ nhật ký lưu lại toàn bộ thao tác: tạo nhóm, thêm khoản chi, sửa số tiền, thanh toán... Đảm bảo minh bạch 100%.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* ── INTERACTIVE DEBT SIMULATOR WIDGET ────────────────────────────── */}
      <Box>
        <DebtSimulator />
      </Box>

      {/* ── 5-STEP WORKFLOW SECTION ───────────────────────────────────────── */}
      <Box sx={{ py: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip label="Quy trình 5 bước đơn giản" color="secondary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            Divvy Xử Lý Nghiệp Vụ Như Thế Nào?
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
            gap: 2,
          }}
        >
          {[
            { step: '01', title: 'Tạo Khoản Chi (Expense)', desc: 'Nhập mô tả ("Ăn lẩu thái"), tổng tiền (1.000.000đ), danh mục và loại tiền.' },
            { step: '02', title: 'Xác Định Người Trả (Payers)', desc: 'Ghi nhận ai đã ứng tiền trước (ví dụ: A trả 800k, B trả 200k).' },
            { step: '03', title: 'Chia Tiền Thành Viên (Shares)', desc: 'Chọn những người tham gia hóa đơn (4 người A, B, C, D -> 250k/người).' },
            { step: '04', title: 'Cấn Trừ Nợ Tự Động (Debts)', desc: 'Divvy tính toán A là chủ nợ, C và D bị ghi nhận nợ A (PENDING).' },
            { step: '05', title: 'Trả Nợ & Thanh Toán (Settlement)', desc: 'C và D chuyển khoản trả A, bấm "Thanh toán" để hoàn thành nợ.' },
          ].map((item, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2.5, borderRadius: 3, textAlign: 'center', height: '100%' }}>
              <Typography variant="h4" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                {item.step}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ── CTA BOTTOM BANNER ─────────────────────────────────────────────── */}
      <Card
        sx={{
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          borderRadius: 4,
          bgcolor: 'primary.main',
          color: '#fff',
          boxShadow: 8,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Sẵn Sàng Quản Lý Quỹ Nhóm Minh Bạch Cùng Divvy?
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, maxWidth: 650, mx: 'auto', mb: 3 }}>
          Không còn phải tự ghi chép hay tính toán thủ công. Hãy trải nghiệm ngay ứng dụng Divvy!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(PATHS.GROUPS)}
          sx={{ bgcolor: '#ffffff', color: 'primary.main', fontWeight: 800, px: 4, py: 1.5, borderRadius: 3, '&:hover': { bgcolor: '#f0fdf4' } }}
        >
          Truy Cập Danh Sách Nhóm Divvy
        </Button>
      </Card>
    </Container>
  );
}
