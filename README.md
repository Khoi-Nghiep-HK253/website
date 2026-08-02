# 💻 Lab Desk Web Workspace

> Enterprise-grade Web Application built with **React 19**, **TypeScript**, **Vite 8**, **Fluent UI v9**, **TanStack Query v5**, and **Storybook 8**.

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)
![Fluent UI v9](https://img.shields.io/badge/Fluent_UI-v9-0078D4?logo=microsoft&logoColor=white)
![TanStack Query v5](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)
![Storybook 8](https://img.shields.io/badge/Storybook-v8.6-FF4785?logo=storybook&logoColor=white)

---

## 🌟 Overview

**Lab Desk Web Workspace** is a modern, modular, enterprise-ready web application setup designed for scalability, zero Git merge conflicts, and exceptional UI/UX standards.

Repository URL: `https://github.com/LabDeskProject/website.git`

---

## ✨ Key Architectural Highlights

- ⚡ **Vite 8 & React 19 Engine**: Lightning-fast hot module replacement (HMR) and production builds.
- 🎨 **Fluent UI v9 Custom Design System**:
  - Custom 16-shade Brand Palette (`BrandVariants`) with `customLightTheme` and `customDarkTheme`.
  - `CustomThemeProvider` supporting **Light Mode ☀️**, **Dark Mode 🌙**, and **System Mode 🖥️** with `localStorage` persistence.
  - Native token overrides (`fontFamilyBase`, `borderRadiusMedium`, `spacingHorizontalM`).
- 🔀 **Decentralized Modular Routing (Zero Git Conflict)**:
  - Feature routes declared locally inside `src/pages/[feature]/[feature].routes.tsx`.
  - Automatic dynamic discovery via Vite's `import.meta.glob` — zero manual edits to main router files.
- 🔄 **Server State Auth Session Management**:
  - Session state managed via **TanStack Query v5** (`useQuery`, `useMutation`, `setQueryData`, `invalidateQueries`).
  - Axios Singleton client with JWT Bearer token request interceptor and global error handling.
- 🛡️ **Higher-Order Components (HOCs)**:
  - Clean `@/hocs` module featuring `withSuspense` and `withProtectedRoute`.
- 📚 **Storybook 8 Integration**:
  - Component library development environment with interactive theme switcher decorator.
- 🧩 **Separation of Concerns (SoC)**:
  - Feature ViewModel Store Hooks (e.g. `useDashboardStore`) separating 100% of business logic from UI JSX elements.

---

## 📂 Project Architecture

```text
website/
├── .storybook/              # Storybook configuration & preview decorators
├── public/                  # Static assets & favicon icons
├── src/
│   ├── components/          # Reusable UI components (Alert, PageLoader, etc.)
│   ├── constants/           # Centralized constants (routes, storage keys)
│   ├── context/             # React Contexts (AuthContext)
│   ├── hocs/                # Higher-Order Components (withSuspense, withProtectedRoute)
│   ├── hooks/               # Custom React & TanStack Query hooks (useAuthQuery, useUserQuery)
│   ├── layouts/             # Application layouts (RootLayout, AuthLayout)
│   ├── lib/                 # Third-party configurations (queryClient singleton)
│   ├── pages/               # Feature-based pages & route modules
│   │   ├── auth/            # LoginPage, RegisterPage, auth.routes.tsx
│   │   ├── dashboard/       # DashboardPage, useDashboardStore, dashboard.routes.tsx
│   │   ├── error/           # ErrorPage, NotFoundPage, error.routes.tsx
│   │   └── home/            # HomePage, home.routes.tsx
│   ├── providers/           # App-level providers (QueryProvider)
│   ├── router/              # Router shell & Vite auto-discovery registry
│   ├── services/            # API service layer (axiosClient, authService, userService)
│   ├── theme/               # Fluent UI Custom Theme (brand, index, ThemeProvider)
│   ├── App.tsx              # Application root
│   ├── index.css            # Minimal global CSS reset
│   └── main.tsx             # Application entry point
├── .env.example             # Environment variables template
├── package.json             # NPM dependencies & scripts
├── THEME.md                 # Theme documentation links
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration with `@/` alias
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LabDeskProject/website.git
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   ```bash
   cp .env.example .env
   ```

---

## 🛠️ Available NPM Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Runs TypeScript type checking (`tsc -b`) and builds production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run storybook` | Starts Storybook UI component explorer on port `6006` |
| `npm run build-storybook` | Builds static Storybook documentation bundle (`storybook-static`) |
| `npm run lint` | Runs ESLint analysis across codebase |

---

## ⚙️ Development Guidelines

### Absolute Imports
Use the `@/` path alias pointing to `src/`:
```typescript
import { PATHS, STORAGE_KEYS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { Alert } from '@/components';
import { withSuspense } from '@/hocs';
```

### Adding New Feature Routes (Conflict-Free)
To add a new page or feature module, create `src/pages/my-feature/my-feature.routes.tsx`:
```typescript
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { withSuspense } from '@/hocs';

const MyFeaturePage = lazy(() => import('./MyFeaturePage'));

export const myFeatureRoutes: RouteObject[] = [
  {
    path: '/my-feature',
    element: withSuspense(MyFeaturePage),
  },
];

export default myFeatureRoutes;
```
*Vite's auto-discovery (`import.meta.glob`) will automatically register your route without touching any main router files.*

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
