import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SendIcon from '@mui/icons-material/Send';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HelpIcon from '@mui/icons-material/Help';
import { type SurveyRequest } from '@/services/surveyService';
import { useAuth } from '@/hooks/common';
import { useSubmitSurveyMutation } from '@/hooks/query';

import { PATHS } from '@/constants/routes';

export default function WelcomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutateAsync: submitSurvey, isPending: isSubmitting } = useSubmitSurveyMutation();

  const usageGoals = useMemo(
    () => [
      { id: 'TRAVEL', label: t('welcome.goalTravel'), icon: <FlightTakeoffIcon /> },
      { id: 'DINING', label: t('welcome.goalDining'), icon: <RestaurantIcon /> },
      { id: 'HOMEMATES', label: t('welcome.goalHomemates'), icon: <HomeWorkIcon /> },
      { id: 'SPORTS', label: t('welcome.goalSports'), icon: <SportsSoccerIcon /> },
      { id: 'OTHER', label: t('welcome.goalOther'), icon: <HelpIcon /> },
    ],
    [t]
  );

  const groupSizes = useMemo(
    () => [
      t('welcome.sizeSmall'),
      t('welcome.sizeMedium'),
      t('welcome.sizeLarge'),
    ],
    [t]
  );

  const painPoints = useMemo(
    () => [
      t('welcome.pain1'),
      t('welcome.pain2'),
      t('welcome.pain3'),
      t('welcome.pain4'),
    ],
    [t]
  );

  const [usageGoal, setUsageGoal] = useState<string>('TRAVEL');
  const [groupSize, setGroupSize] = useState<string>(groupSizes[0]);
  const [primaryPainPoint, setPrimaryPainPoint] = useState<string>(painPoints[0]);
  const [rating, setRating] = useState<number | null>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUsageGoalSelect = useCallback((goalId: string) => {
    setUsageGoal(goalId);
  }, []);

  const handleGroupSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSize(e.target.value);
  }, []);

  const handlePainPointChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryPainPoint(e.target.value);
  }, []);

  const handleRatingChange = useCallback((_: React.SyntheticEvent, newValue: number | null) => {
    setRating(newValue);
  }, []);

  const handleFeedbackChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackText(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);

      try {
        const payload: SurveyRequest = {
          userId: user?.id,
          email: user?.email,
          usageGoal,
          groupSize,
          primaryPainPoint,
          rating: rating || 5,
          feedbackText,
        };

        await submitSurvey(payload);
        navigate(PATHS.THANK_YOU);
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMsg(error.message || t('welcome.submitError'));
      }
    },
    [user, usageGoal, groupSize, primaryPainPoint, rating, feedbackText, submitSurvey, navigate, t]
  );

  const welcomeHeroTitle = useMemo(
    () =>
      user?.username
        ? t('welcome.heroTitle', { username: user.username })
        : t('welcome.heroTitleGuest'),
    [user, t]
  );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Welcome Hero Banner */}
      <Card
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 4,
          textAlign: 'center',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'primary.light',
          boxShadow: '0 20px 40px -15px rgba(16, 185, 129, 0.2)',
        }}
      >
        <Chip
          icon={<RocketLaunchIcon sx={{ color: '#10b981 !important' }} />}
          label={t('welcome.badge')}
          color="primary"
          variant="outlined"
          sx={{ mb: 2, fontWeight: 700, px: 1, py: 0.5 }}
        />
        <Typography variant="h3" component="h1" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
          {welcomeHeroTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto', lineHeight: 1.6 }}>
          {t('welcome.heroSub')}
        </Typography>
      </Card>

      {/* Interactive Survey Form */}
      <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
            {t('welcome.surveyTitle')}
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Question 1: Usage Goal */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                {t('welcome.q1Label')}
              </FormLabel>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                {usageGoals.map((goal) => {
                  const isSelected = usageGoal === goal.id;
                  return (
                    <Card
                      key={goal.id}
                      onClick={() => handleUsageGoalSelect(goal.id)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        bgcolor: isSelected ? 'action.hover' : 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.light',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box sx={{ color: isSelected ? 'primary.main' : 'text.secondary' }}>{goal.icon}</Box>
                      <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                        {goal.label}
                      </Typography>
                    </Card>
                  );
                })}
              </Box>
            </FormControl>

            {/* Question 2: Group Size */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                {t('welcome.q2Label')}
              </FormLabel>
              <RadioGroup
                row
                value={groupSize}
                onChange={handleGroupSizeChange}
                sx={{ gap: 2 }}
              >
                {groupSizes.map((size) => (
                  <FormControlLabel
                    key={size}
                    value={size}
                    control={<Radio color="primary" />}
                    label={size}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Question 3: Primary Pain Point */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                {t('welcome.q3Label')}
              </FormLabel>
              <RadioGroup
                value={primaryPainPoint}
                onChange={handlePainPointChange}
                sx={{ gap: 1 }}
              >
                {painPoints.map((point) => (
                  <FormControlLabel
                    key={point}
                    value={point}
                    control={<Radio color="primary" />}
                    label={point}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Question 4: Initial Rating */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                {t('welcome.q4Label')}
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={handleRatingChange}
                size="large"
              />
            </Box>

            {/* Question 5: Feedback Text */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                {t('welcome.q5Label')}
              </Typography>
              <TextField
                multiline
                rows={3}
                fullWidth
                placeholder={t('welcome.feedbackPlaceholder')}
                value={feedbackText}
                onChange={handleFeedbackChange}
                variant="outlined"
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.05rem',
                fontWeight: 700,
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              {isSubmitting ? t('welcome.submitting') : t('welcome.submitBtn')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
