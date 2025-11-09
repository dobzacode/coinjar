<!-- 713b173a-331f-45ea-909a-c350d4297c0c c91f5c63-4885-4cc0-a7bc-61e08092758e -->
# Next.js 16 Savings Tracker Application

## Project Architecture

### Folder Structure (Feature-Based)

```
/
├── .cursor/
│   └── rules/
│       └── project-context.mdc
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── livret-a/
│   │   │   ├── pee/
│   │   │   ├── pea/
│   │   │   ├── overview/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/[...all]/
│   │   │   ├── cron/
│   │   │   └── etf/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── charts/
│   │   ├── forms/
│   │   └── layout/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── validations/
│   │   └── utils/
│   ├── features/
│   │   ├── livret-a/
│   │   ├── pee/
│   │   └── pea/
│   └── types/
├── drizzle/
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── components/
└── config files
```

## Implementation Phases

### Phase 1: Project Initialization & Configuration

**1.1 Initialize Next.js 16 Project**

- Create Next.js 16 app with TypeScript, Tailwind CSS, and App Router
- Configure `next.config.ts` for optimal performance

**1.2 Install Core Dependencies**

```bash
# Core framework
next@16, react, react-dom, typescript

# UI & Styling
shadcn-ui, tailwindcss, tailwind-merge, class-variance-authority

# State Management
nuqs

# Database
@neondatabase/serverless, drizzle-orm, drizzle-kit, postgres

# Authentication
better-auth

# Validation
zod, react-hook-form, @hookform/resolvers

# Charts
recharts

# Date handling
date-fns
```

**1.3 Setup Development Tooling**

- ESLint 9+ with flat config (`eslint.config.mjs`)
- Prettier with `.prettierrc`
- Husky + lint-staged for pre-commit hooks
- Vitest configuration for unit tests
- Playwright configuration for E2E tests
- React Testing Library setup

**1.4 Create project-context.mdc**

Document complete technical stack, architectural decisions, folder structure, and development guidelines

### Phase 2: Database Schema & Configuration

**2.1 Drizzle ORM Setup**

- Configure `drizzle.config.ts` for Neon PostgreSQL
- Create database connection utility

**2.2 Define Database Schema** (`src/lib/db/schema.ts`)

Tables:

- `users` (id, email, name, createdAt)
- `accounts` (OAuth provider data for Better Auth)
- `sessions` (Better Auth sessions)
- `livret_a` (id, userId, balance, currentRate, lastInterestDate, createdAt, updatedAt)
- `livret_a_transactions` (id, livretId, amount, type, date, description)
- `livret_a_rate_history` (id, rate, effectiveDate)
- `pee_accounts` (id, userId, companyName, sharePrice, totalShares, createdAt, updatedAt)
- `pee_contributions` (id, peeAccountId, type [abondement/participation/interessement], amount, shares, date)
- `pea_accounts` (id, userId, name, totalInvestment, createdAt, updatedAt)
- `pea_holdings` (id, peaAccountId, isin, name, shares, purchasePrice, purchaseDate, lastUpdatedPrice, lastUpdatedAt)
- `etf_prices_cache` (id, isin, price, currency, fetchedAt)

**2.3 Generate and Run Migrations**

- Create migration files via `drizzle-kit generate`
- Apply migrations to Neon database

### Phase 3: Authentication Layer

**3.1 Better Auth Setup**

- Configure Better Auth with OAuth (Google provider)
- Create auth configuration in `src/lib/auth/config.ts`
- Setup auth API routes at `src/app/api/auth/[...all]/route.ts`
- Create auth utilities and hooks

**3.2 Auth Middleware**

- Implement middleware for protected routes
- Create session management utilities

**3.3 Auth UI Components**

- Login page with Google OAuth button
- User profile dropdown
- Sign out functionality

### Phase 4: Core Features Implementation

**4.1 Livret A Feature**

Components:

- `livret-a-overview.tsx`: Display current balance, interest earned, rate
- `livret-a-form.tsx`: Add transactions (deposit/withdrawal)
- `livret-a-rate-form.tsx`: Update current rate
- `livret-a-history.tsx`: Transaction history table
- `livret-a-chart.tsx`: Balance evolution chart

Logic (`src/features/livret-a/`):

- `calculations.ts`: French Livret A interest calculation logic (quinzaines system)
- `queries.ts`: Database queries with Drizzle
- `actions.ts`: Server actions for mutations

Validation:

- `livret-a-schema.ts`: Zod schemas for forms

**4.2 PEE Feature**

Components:

- `pee-overview.tsx`: Total value, shares owned, breakdown by contribution type
- `pee-contribution-form.tsx`: Add contributions (abondement/participation/interessement)
- `pee-share-price-form.tsx`: Update company share price
- `pee-history.tsx`: Contributions history
- `pee-chart.tsx`: Value evolution chart

Logic (`src/features/pee/`):

- `calculations.ts`: Calculate total value based on shares × price
- `queries.ts`: Database queries
- `actions.ts`: Server actions

Validation:

- `pee-schema.ts`: Zod schemas

**4.3 PEA Feature**

Components:

- `pea-overview.tsx`: Total invested, current value, gain/loss, performance
- `pea-holding-form.tsx`: Add/edit ETF holdings
- `pea-holdings-list.tsx`: Display all holdings with live prices
- `pea-chart.tsx`: Portfolio allocation and performance charts

Logic (`src/features/pea/`):

- `calculations.ts`: Calculate portfolio metrics (total value, gains, performance %)
- `queries.ts`: Database queries
- `actions.ts`: Server actions
- `etf-service.ts`: Fetch ETF prices from Yahoo Finance API

Validation:

- `pea-schema.ts`: Zod schemas

**4.4 Dashboard Overview**

- Aggregate view of all three investment types
- Total wealth calculation
- Combined performance charts
- Quick stats cards

### Phase 5: Vercel Functions (Serverless Cron Jobs)

**5.1 Livret A Interest Calculation Function**

- Create `src/app/api/cron/livret-a-interest/route.ts`
- Implement annual interest calculation (January 1st)
- Configure Vercel Cron in `vercel.json` for yearly execution
- Add interest to balance and create transaction record

**5.2 ETF Price Update Function**

- Create `src/app/api/cron/update-etf-prices/route.ts`
- Fetch latest prices for all unique ISINs from Yahoo Finance
- Update `pea_holdings` and `etf_prices_cache`
- Configure Vercel Cron for daily execution (market close)
- Implement rate limiting and error handling

**5.3 Manual Trigger Endpoints**

- Create API endpoints for manual price refresh
- Add "Refresh Prices" button in PEA interface

### Phase 6: UI & Responsive Design

**6.1 Setup Shadcn UI**

- Initialize shadcn-ui with `npx shadcn@latest init`
- Install required components: Button, Card, Form, Input, Select, Table, Dialog, Tabs, Chart

**6.2 Layout Components**

- App shell with navigation sidebar
- Responsive header with user menu
- Mobile navigation drawer
- Footer

**6.3 Responsive Implementation**

- Mobile-first approach with Tailwind breakpoints
- Touch-friendly interactive elements
- Collapsible sections for mobile
- Responsive tables and charts

**6.4 Theme & Styling**

- Dark/light mode support with next-themes
- CSS variables for theming
- Consistent spacing and typography

### Phase 7: Testing

**7.1 Unit Tests (Vitest)**

- Test calculation functions (Livret A interest, PEE value, PEA performance)
- Test validation schemas
- Test utility functions
- Target coverage: >80%

**7.2 Component Tests (React Testing Library)**

- Test form components with user interactions
- Test data display components
- Test loading and error states

**7.3 E2E Tests (Playwright)**

- User authentication flow
- Add Livret A transaction
- Add PEE contribution
- Add PEA holding
- View dashboard overview
- Update rates/prices

### Phase 8: Deployment & Environment Setup

**8.1 Environment Configuration**

Create `.env.example` with:

```
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
YAHOO_FINANCE_API_KEY= (if needed)
```

**8.2 Vercel Configuration**

- Create `vercel.json` with cron schedules
- Configure environment variables in Vercel dashboard
- Setup Neon database connection

**8.3 Build & Deploy**

- Verify build succeeds locally
- Deploy to Vercel
- Test production deployment
- Verify cron jobs execution

## Key Technical Details

### Livret A Interest Calculation Logic

French Livret A uses "quinzaines" (fortnights):

- Interest calculated per fortnight (1-15, 16-end of month)
- Deposits count from next fortnight
- Withdrawals count from current fortnight
- Annual rate divided by 24 fortnights
- Interest paid on January 1st

### Yahoo Finance Integration

- Use unofficial Yahoo Finance API
- Endpoint: `https://query1.finance.yahoo.com/v8/finance/chart/{ISIN}.PA`
- Parse JSON response for current price
- Cache prices in database
- Implement exponential backoff for failures

### Better Auth Configuration

- OAuth with Google provider only
- Session stored in database
- CSRF protection enabled
- Secure cookie settings

### Database Optimization

- Index on userId for all account tables
- Index on ISIN for price lookups
- Composite index on (userId, date) for transactions
- Use Neon's connection pooling

## Files to Create (Key Files)

1. `.cursor/rules/project-context.mdc` - Complete project documentation
2. `src/lib/db/schema.ts` - Database schema
3. `src/lib/auth/config.ts` - Better Auth configuration
4. `src/features/livret-a/calculations.ts` - Interest calculation logic
5. `src/features/pea/etf-service.ts` - Yahoo Finance integration
6. `src/app/api/cron/livret-a-interest/route.ts` - Annual interest cron
7. `src/app/api/cron/update-etf-prices/route.ts` - Daily price update cron
8. `eslint.config.mjs` - ESLint 9 flat config
9. `vitest.config.ts` - Vitest configuration
10. `playwright.config.ts` - Playwright configuration

### To-dos

- [ ] Initialize Next.js 16 project with TypeScript, install core dependencies, and setup tooling (ESLint 9, Prettier, Husky)
- [ ] Create comprehensive project-context.mdc documenting architecture, stack, and guidelines
- [ ] Configure Drizzle ORM, define complete database schema, and run migrations to Neon
- [ ] Setup Better Auth with Google OAuth, create auth routes, middleware, and login UI
- [ ] Implement Livret A feature with French interest calculation, forms, and charts
- [ ] Implement PEE feature with contribution tracking and value calculations
- [ ] Implement PEA feature with ETF holdings, Yahoo Finance integration, and portfolio metrics
- [ ] Implement Vercel cron functions for annual Livret A interest and daily ETF price updates
- [ ] Create main dashboard with aggregated overview of all investment types
- [ ] Configure and write unit tests (Vitest), component tests (RTL), and E2E tests (Playwright)
- [ ] Configure environment variables, setup Vercel deployment, and verify production functionality