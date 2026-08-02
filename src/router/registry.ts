import type { RouteObject } from 'react-router-dom';

interface RouteModule {
  default?: RouteObject | RouteObject[];
  routes?: RouteObject | RouteObject[];
}

/**
 * Automatically discover all *.routes.tsx files in src/pages using Vite import.meta.glob
 */
const routeModules = import.meta.glob<RouteModule>('@/pages/**/*.routes.tsx', {
  eager: true,
});

export const registeredRoutes: RouteObject[] = Object.values(routeModules).flatMap((module) => {
  const routes = module.default || module.routes || [];
  return Array.isArray(routes) ? routes : [routes];
});
