import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DebtSimulator } from '@/components';
import { useHomeStore } from './hooks/useHomeStore';
import {
  HomeHeroBanner,
  HomeFeaturesGrid,
  HomeWorkflowSteps,
  HomeCtaBanner,
} from './components';

export default function HomePage() {
  const {
    isAuthenticated,
    user,
    workflowSteps,
    handleNavigateGroups,
    handleNavigateRegister,
  } = useHomeStore();

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Hero Banner Section */}
      <HomeHeroBanner
        isAuthenticated={isAuthenticated}
        user={user}
        onNavigateGroups={handleNavigateGroups}
        onNavigateRegister={handleNavigateRegister}
      />

      {/* Core Entities & Features Showcase */}
      <HomeFeaturesGrid />

      {/* Interactive Debt Simulator Widget */}
      <Box>
        <DebtSimulator />
      </Box>

      {/* 5-Step Workflow Section */}
      <HomeWorkflowSteps steps={workflowSteps} />

      {/* CTA Bottom Banner */}
      <HomeCtaBanner onNavigateGroups={handleNavigateGroups} />
    </Container>
  );
}
