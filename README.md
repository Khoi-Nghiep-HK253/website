# 💰 Divvy – Sổ Quỹ Thông Minh Cho Nhóm

> Ứng dụng web hiện đại giúp các nhóm bạn, gia đình hoặc đồng nghiệp quản lý chi tiêu chung, tự động tính toán đối trừ công nợ và thanh toán minh bạch.

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)
![MUI v6](https://img.shields.io/badge/MUI-v6-007FFF?logo=mui&logoColor=white)
![TanStack Query v5](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white)
![Storybook 8](https://img.shields.io/badge/Storybook-v8.6-FF4785?logo=storybook&logoColor=white)

Repository: `https://github.com/Khoi-Nghiep-HK253/website.git`

---

## 🌟 Giới Thiệu Tính Năng

**Divvy** giúp giải quyết bài toán chia tiền & quản lý công nợ cho các nhóm đi du lịch, nhóm ở chung nhà, nhóm đá bóng hoặc dự án làm việc:

- 👥 **Quản lý Nhóm & Thành viên**: Tạo nhóm chi tiêu theo danh mục (Ăn uống, Du lịch, Sinh hoạt, Học tập...), mời thành viên và quản lý vai trò.
- 💵 **Tạo & Chia Khoản Chi Đa Dạng (5 Split Modes)**:
  - `EQUAL`: Chia đều cho các thành viên tham gia.
  - `EXACT`: Nhập số tiền chính xác từng người gánh chịu.
  - `PERCENTAGE`: Chia theo tỷ lệ phần trăm (tổng = 100%).
  - `SHARES`: Chia theo khẩu phần/tỷ lệ (ratio).
  - `ADJUSTMENT`: Chia đều kèm điều chỉnh ± (tổng điều chỉnh = 0).
- 💳 **Hỗ trợ Nhiều Người Ứng Tiền (Multi-Payer)**: Cho phép nhiều thành viên cùng ứng trước tiền trong một hóa đơn.
- ⚡ **Thuật Toán Cấn Trừ Công Nợ Tự Động (Min-cut Settlement Algorithm)**: Tự động tính toán đối trừ để giảm tối đa số giao dịch chuyển tiền giữa các thành viên ("Ai Nợ Ai").
- 🤝 **Lịch Sử Thanh Toán**: Đánh dấu trả nợ từng khoản chi tiêu, xem chi tiết lịch sử thanh toán.
- 🧮 **Bộ Mô Phỏng Divvy Simulator**: Trải nghiệm thử thuật toán chia tiền tự động trực tiếp trên giao diện.

---

## ✨ Kiến Trúc Mã Nguồn & Công Nghệ

- ⚡ **Vite 8 & React 19 Engine**: HMR siêu tốc, tối ưu đóng gói bundle sản phẩm.
- 🎨 **Material UI (MUI v6) Custom Design System**:
  - Hệ màu tailored harmonious (Emerald Green & Sleek Dark theme).
  - Component hóa theo mô hình Barrel Export (`components/index.ts`).
- 🔀 **Decentralized Modular Routing (Không lo Xung đột Git)**:
  - Tự động phát hiện Route theo tính năng (`import.meta.glob`).
- 🔄 **Strict Separation of Services & React Query Hooks**:
  - **Services**: `authService`, `userService`, `groupService`, `expenseService`, `debtService`, `settlementService`, `categoryService`, `currencyService`.
  - **Hooks**: `useAuthQuery`, `useGroupQuery`, `useExpenseQuery`, `useDebtQuery`, `useSettlementQuery`, `useMasterQuery`.
- 📚 **Storybook 8 Integration**:
  - Hỗ trợ xây dựng và phát triển UI component độc lập với `DebtSimulator.stories.tsx`.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
website/
├── .storybook/              # Cấu hình Storybook & Preview decorator
├── public/                  # Tài nguyên tĩnh & favicon icons
├── src/
│   ├── components/          # UI Component dùng chung (Alert, PageLoader, DivvySimulator)
│   ├── constants/           # Hằng số hệ thống (PATHS, STORAGE_KEYS)
│   ├── context/             # React Contexts (AuthContext)
│   ├── hocs/                # Higher-Order Components (withSuspense, withProtectedRoute)
│   ├── hooks/               # React Query hooks chuyên biệt
│   │   ├── useGroupQuery.ts # Hooks cho Nhóm & Thành viên
│   │   ├── useExpenseQuery.ts # Hooks cho Khoản chi
│   │   ├── useDebtQuery.ts   # Hooks cho Công nợ
│   │   ├── useSettlementQuery.ts # Hooks cho Thanh toán
│   │   ├── useMasterQuery.ts # Hooks cho Master Data (Categories, Currencies)
│   │   └── index.ts
│   ├── layouts/             # Layouts ứng dụng (RootLayout, AuthLayout)
│   ├── pages/               # Trang và mô-đun theo tính năng
│   │   ├── auth/            # LoginPage, RegisterPage
│   │   ├── dashboard/       # DashboardPage & Dashboard Components
│   │   ├── groups/          # GroupsListPage, GroupDetailPage & Group Components
│   │   └── home/            # HomePage
│   ├── providers/           # App Providers (QueryProvider)
│   ├── router/              # Router shell & tự động phát hiện Route
│   ├── services/            # Tầng giao tiếp APIs chuyên biệt
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── groupService.ts
│   │   ├── expenseService.ts
│   │   ├── debtService.ts
│   │   ├── settlementService.ts
│   │   ├── categoryService.ts
│   │   └── currencyService.ts
│   ├── theme/               # MUI Design System Theme Config
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entrypoint
├── package.json             # NPM scripts & dependencies
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration with `@/` alias
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Cần Có

- **Node.js**: `v18.0.0` trở lên
- **npm**: `v9.0.0` trở lên
- **Backend Service**: Spring Boot API đang chạy trên `http://localhost:8080` (hoặc cấu hình URL trong `.env`)

### Cài Đặt

1. Clone repository:
   ```bash
   git clone https://github.com/Khoi-Nghiep-HK253/website.git
   cd website
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Cấu hình môi trường:
   ```bash
   cp .env.example .env
   ```

---

## 🛠️ Danh Sách NPM Scripts

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy Vite Dev Server cho ứng dụng Frontend |
| `npm run build` | Kiểm tra TypeScript strict (`tsc -b`) và biên dịch đóng gói sản phẩm (`vite build`) |
| `npm run preview` | Xem trước bản build sản phẩm local |
| `npm run storybook` | Mở Storybook UI Component Explorer trên cổng `6006` |
| `npm run build-storybook` | Biên dịch trang Storybook tĩnh |
| `npm run lint` | Chạy phân tích mã nguồn với ESLint |

---

## 📄 Giấy Phép

Distributed under the **MIT License**.
