# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Codefend Panel** - a security platform desktop application built as a hybrid web/desktop app using React + Tauri. The application provides security monitoring, vulnerability scanning, resource management, and comprehensive security reporting capabilities.

## Development Commands

### Core Development
- `bun dev` or `npm run dev` - Start development server
- `bun run build` or `npm run build` - Build for production
- `bun start` or `npm start` - TypeScript compile + Vite dev server
- `bun preview` or `npm run preview` - Preview production build

### Code Quality
- `bun run checking` or `npm run checking` - Run all checks (lint, format, types)
- `bun lint:fix` or `npm run lint:fix` - Fix linting issues
- `bun format:fix` or `npm run format:fix` - Fix formatting issues
- `bun types:check` or `npm run types:check` - TypeScript type checking

### Tauri Desktop App
- `bun tauri dev` - Start Tauri development (desktop app)
- `bun tauri build` - Build desktop application
- `bun run build-tauri-windows` - Build signed Windows package

## Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript, SCSS modules
- **Desktop**: Tauri v2 (Rust backend)
- **State Management**: React Context (primary), Zustand (legacy)
- **Data Fetching**: SWR, custom hooks, Axios
- **UI Libraries**: Framer Motion, Chart.js, D3.js
- **Build**: Vite + SWC
- **Code Quality**: ESLint + Prettier + Husky

### Project Structure
```
src/app/
├── constants/           # App constants, texts, validations
├── data/               # Business logic layer
│   ├── hooks/          # Custom React hooks (organized by feature)
│   ├── interfaces/     # TypeScript interfaces
│   ├── services/       # API communication layer
│   ├── store/          # State management (Zustand stores)
│   └── utils/          # Utility functions
├── router/             # React Router configuration
└── views/              # UI layer
    ├── components/     # Reusable UI components
    ├── pages/          # Page-level components
    ├── contexts/       # React Context providers
    └── styles/         # Global styles (SCSS)
```

### Key Architectural Patterns

**Feature-First Organization**: Code is organized by feature modules (enp, inx, sns, vdb, etc.) within the hooks directory, promoting maintainability and discoverability.

**Data Fetching Strategy**: Uses SWR for caching with custom hooks that encapsulate business logic. Each feature module has dedicated hooks for data operations.

**Dual Platform Support**: 
- Web application runs via Vite dev server
- Desktop application wraps the web app in Tauri with additional native capabilities

**State Management Hybrid**:
- React Context for application-wide state
- Zustand stores for complex state scenarios (legacy, being migrated)

### Security Features
The application implements comprehensive security monitoring including:
- External Network Penetration (ENP) scanning
- Intelligence Search (INX) capabilities  
- Social Network Security (SNS) monitoring
- Vulnerability Database (VDB) integration
- Resource management (web, mobile, cloud, network)
- Issue tracking and reporting
- Quality surveys and feedback systems

## Development Guidelines

### Code Standards
- Follow the Cursor rules in `.cursor/rules/react.mdc`
- Use functional components with TypeScript
- Implement proper error handling with early returns
- No ESLint rule bypassing allowed
- Use descriptive variable names with auxiliary verbs
- Structure files: components → subcomponents → helpers → types

### Component Patterns
- Use SCSS modules for styling (`.module.scss`)
- Implement responsive design with mobile-first approach
- Optimize images (WebP format, lazy loading)
- Minimize `useEffect` usage
- Prefer composition over inheritance

### Data Management
- Use SWR for server state management
- Create custom hooks for business logic
- Implement proper loading and error states
- Follow the established pattern in `data/hooks/` directories

## Environment Setup

### Prerequisites
- Node.js 22+
- Bun or npm/pnpm
- Rust (for Tauri desktop builds)

### Configuration
- Copy `example.dev.env` to `.env` with appropriate values
- Vite configuration handles path aliases from `tsconfig.app.json`
- Tauri configuration in `src-tauri/tauri.conf.json`

## Testing & Quality

- Run `bun run checking` before commits
- Husky pre-commit hooks enforce code quality
- Use `bun run spellcheck` for spell checking on changed files
- Type checking is mandatory (`bun types:check`)

## Desktop App Specifics

### Tauri Integration
- Rust backend provides native system access
- Signed builds for Windows distribution  
- Auto-updater functionality configured
- Plugin system for native capabilities (notifications, file system, etc.)

### Build Targets
- Windows: NSIS installer with signing
- macOS: DMG and .app bundles
- Linux: DEB and AppImage formats