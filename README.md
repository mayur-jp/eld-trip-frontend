# ELD Trip Planner - Frontend

React single-page application for planning FMCSA Hours of Service (HOS) compliant trips. Displays interactive route maps, stop markers, and ELD-style daily log sheets.

## Tech Stack

- React 19 + TypeScript (strict mode)
- Vite 8
- Tailwind CSS
- Leaflet / React-Leaflet (maps)
- Axios (HTTP client)
- Radix UI (accessible primitives)
- Lucide React (icons)
- React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

---

## Local Development

```bash
cd eld-trip-frontend

# Install dependencies
npm install

# Configure environment
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Production Setup

### 1. Build

```bash
cd eld-trip-frontend

# Install dependencies
npm install

# Set the production API URL
echo "VITE_API_BASE_URL=https://your-backend-domain.com/api" > .env

# Build for production
npm run build
```

This outputs static files to the `dist/` directory.

### 2. Serve with PM2

PM2 is used to keep the production server running. The app uses the `serve` package to serve the static build.

```bash
# Install serve and pm2 globally (if not already installed)
npm install -g serve pm2

# Start with PM2
npm run start:production
# or directly:
pm2 start ecosystem.config.json

# PM2 management commands
pm2 status              # Check status
pm2 logs eld-trip-frontend  # View logs
pm2 restart eld-trip-frontend  # Restart
pm2 stop eld-trip-frontend     # Stop
```

The `ecosystem.config.json` runs `serve -s dist -l 5173`, serving the built files on port 5173.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |
| `npm run serve:production` | Serve `dist/` on port 5173 |
| `npm run start:production` | Start production server via PM2 |

## Project Structure

```
eld-trip-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # Backend API wrapper (Axios)
│   ├── components/
│   │   ├── layout/        # Page layout components
│   │   ├── log/           # ELD daily log sheet (SVG renderer)
│   │   ├── map/           # Leaflet map with route & stop markers
│   │   ├── sidebar/       # Sidebar navigation
│   │   ├── summary/       # Trip summary display
│   │   ├── trip/          # Trip input form
│   │   └── ui/            # Reusable UI primitives
│   ├── constants/         # App-wide constants
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── layout/            # Layout wrappers
│   ├── lib/               # Utilities & shared styles
│   ├── pages/             # Route page components
│   ├── types/             # TypeScript interfaces
│   ├── App.tsx            # Root component with routing
│   └── main.tsx           # Entry point
├── index.html
├── ecosystem.config.json  # PM2 config for production
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Key Files

- **`src/context/TripContext.tsx`** - Global state management (TripResponse, loading, errors)
- **`src/components/log/DailyLogSheet.tsx`** - SVG-based ELD log sheet renderer
- **`src/components/map/TripMap.tsx`** - Leaflet map with route polyline and stop markers
- **`src/components/trip/TripInputForm.tsx`** - Main trip planning input form
- **`src/api/tripApi.ts`** - Backend API client
- **`src/types/`** - TypeScript interfaces for Trip, Log, Route, DutyStatus

## Code Conventions

- TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`)
- No `any` types or `!` non-null assertions
- Functional components only with typed props interfaces
- Tailwind CSS for all styling (reusable classes in `lib/styles.ts`)
- Path alias: `@/` maps to `src/`
- Import order: React, third-party, `import type`, hooks/context, components/utils
