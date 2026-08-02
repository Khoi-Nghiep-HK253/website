import React, { Suspense } from 'react';
import { PageLoader } from '@/components/PageLoader';

/**
 * Higher-Order Component (HOC) to wrap dynamic lazy-loaded components with Suspense fallback
 */
export function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}
