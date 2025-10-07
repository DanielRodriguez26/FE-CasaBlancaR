# TaskFlow - Real-time Collaborative Task Manager

A modern, real-time collaborative task management application built with React 19, TypeScript, and Socket.io.

## 🚀 Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **State Management:** Zustand
- **Server State:** TanStack Query (React Query)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Real-time:** Socket.io Client
- **Testing:** Vitest + React Testing Library
- **Code Quality:** ESLint + Prettier

## 📋 Prerequisites

- **Node.js:** >= 20.19.0
- **pnpm:** >= 9.0.0

## 🛠️ Installation

1. **Install pnpm** (if not already installed):
```bash
npm install -g pnpm
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

## 🏃 Running the Application

### Development Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

## 🧪 Testing

### Run Tests
```bash
pnpm test
```

### Run Tests with UI
```bash
pnpm test:ui
```

### Generate Coverage Report
```bash
pnpm test:coverage
```

## 🔍 Code Quality

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

### Auto-fix Linting Issues
```bash
pnpm lint:fix
```

### Format Code
```bash
pnpm format
```

## 📁 Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/
│   ├── dashboard/
│   ├── task-management/
│   ├── collaboration/
│   ├── comments/
│   └── workspace/
├── global/            # Global shared components
│   ├── components/
│   ├── hooks/
│   └── utils/
├── services/          # External services
│   ├── api/
│   ├── socket/
│   └── storage/
├── stores/            # Zustand stores
├── types/             # TypeScript types
└── routes/            # Routing configuration
```

## 🌟 Features

- ✅ **Phase 1: Foundation** (Completed)
  - Project setup with React 19 + TypeScript
  - State management with Zustand
  - Routing with role-based access control
  - Type-safe architecture

- 🚧 **Phase 2: Core Task Management** (In Progress)
  - Task CRUD operations
  - Local storage persistence
  - Task filtering and sorting

- 📅 **Phase 3: Backend & Authentication** (Planned)
  - REST API integration
  - JWT authentication
  - User management

- 📅 **Phase 4: Real-time Collaboration** (Planned)
  - Socket.io integration
  - Live task updates
  - User presence indicators

- 📅 **Phase 5: Advanced Features** (Planned)
  - Conflict resolution
  - Comments & mentions
  - Offline support

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with path aliases
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `vitest.config.ts` - Vitest testing configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier configuration

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests |
| `pnpm test:ui` | Run tests with UI |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm lint` | Lint code |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Check TypeScript types |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC
