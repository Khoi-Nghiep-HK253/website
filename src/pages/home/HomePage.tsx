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
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/router/routes';
import { useAuth } from '@/hooks/common';
import { useDocumentTitle } from '@/hooks/common/useDocumentTitle';
import { DebtSimulator } from '@/components/DivvySimulator/DebtSimulator';

export default function HomePage() {
  const { t } = useTranslation();
  useDocumentTitle(t('common.appName') + ' — ' + t('common.appTagline'));
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
          label={t('home.badge')}
          color="primary"
          variant="outlined"
          sx={{ mb: 2, fontWeight: 700, px: 1, py: 0.5 }}
        />

        <Typography variant="h2" component="h1" color="primary.main" sx={{ fontSize: { xs: '2rem', md: '3.25rem' }, mb: 2, fontWeight: 800 }}>
          {t('home.heroTitle')}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4, fontWeight: 400, lineHeight: 1.6 }}
        >
          {t('home.heroSub')}
        </Typography>

        {isAuthenticated && (
          <Box sx={{ mb: 3 }}>
            <Chip
              icon={<CheckCircleIcon color="success" />}
              label={t('home.welcomeUser', { username: user?.username || user?.email })}
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
            onClick={() => navigate(PATHS.GROUPS.LIST)}
            sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
          >
            {isAuthenticated ? t('home.enterGroups') : t('home.exploreGroups')}
          </Button>

          {!isAuthenticated && (
            <Button
              variant="outlined"
              size="large"
              color="primary"
              onClick={() => navigate(PATHS.REGISTER)}
              sx={{ px: 4, py: 1.5, borderRadius: 3, fontSize: '1.05rem', fontWeight: 700 }}
            >
              {t('home.registerFree')}
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
              {t('home.tagTravel')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <HomeWorkIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('home.tagHome')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <SportsSoccerIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('home.tagSports')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <WorkIcon color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('home.tagWork')}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* ── CORE ENTITIES & FEATURES SHOWCASE ────────────────────────────── */}
      <Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip label={t('home.archBadge')} color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            {t('home.archTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {t('home.archSub')}
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
              {t('home.feature1Title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.feature1Desc')}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', mb: 2 }}>
              <PersonAddIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t('home.feature2Title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.feature2Desc')}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'info.light', color: 'info.contrastText', mb: 2 }}>
              <ReceiptLongIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t('home.feature3Title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.feature3Desc')}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.contrastText', mb: 2 }}>
              <AccountBalanceIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t('home.feature4Title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.feature4Desc')}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'success.light', color: 'success.contrastText', mb: 2 }}>
              <CheckCircleIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t('home.feature5Title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.feature5Desc')}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Avatar sx={{ bgcolor: 'error.light', color: 'error.contrastText', mb: 2 }}>
              <HistoryIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t('home.feature6Title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.feature6Desc')}
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
          <Chip label={t('home.workflowBadge')} color="secondary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            {t('home.workflowTitle')}
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
            { step: '01', title: t('home.step1Title'), desc: t('home.step1Desc') },
            { step: '02', title: t('home.step2Title'), desc: t('home.step2Desc') },
            { step: '03', title: t('home.step3Title'), desc: t('home.step3Desc') },
            { step: '04', title: t('home.step4Title'), desc: t('home.step4Desc') },
            { step: '05', title: t('home.step5Title'), desc: t('home.step5Desc') },
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
          {t('home.ctaTitle')}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, maxWidth: 650, mx: 'auto', mb: 3 }}>
          {t('home.ctaSub')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(PATHS.GROUPS.LIST)}
          sx={{ bgcolor: '#ffffff', color: 'primary.main', fontWeight: 800, px: 4, py: 1.5, borderRadius: 3, '&:hover': { bgcolor: '#f0fdf4' } }}
        >
          {t('home.ctaBtn')}
        </Button>
      </Card>
    </Container>
  );
}
