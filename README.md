# CoinJar - Savings Tracker

A modern, full-stack web application for tracking and managing your French savings accounts (Livret A, PEA, and PEE) with beautiful visualizations and comprehensive portfolio management.

## 🚀 Features

### ✨ Core Functionality

- **Smart Dashboard**: Visual wealth evolution tracking with intelligent chart generation
  - Chart starts from user signup date or first transaction (whichever is later)
  - Dynamic data points based on account age (2-12 months displayed)
  - No historical data shown from before user joined
- **Livret A Management**: Track your regulated savings account with transaction history
- **PEA Portfolio**: Manage your equity savings plan with real-time ISIN validation via Yahoo Finance
- **PEE Tracking**: Monitor employee savings plans with contribution breakdowns
- **Multi-language Support**: Full i18n support for English and French
- **Dark Mode**: Beautiful theme switching with system preferences detection
- **Real-time Validation**: TanStack Query-powered ISIN validation with caching and error handling
- **Toast Notifications**: Success/error feedback with Sonner and fully internationalized messages
- **Skeleton Loading**: Comprehensive loading states across all pages for better UX
- **Smart Forms**: All forms use `form.formState.isSubmitting` for precise loading state tracking

### 🎨 Design & UX

- **Modern UI**: Built with Shadcn UI and Radix primitives
- **Skeleton States**: Dedicated skeleton loading components for each feature page
- **Green Theme**: Strong brand identity with customizable green color palette
- **Custom Typography**: Outfit font for modern, clean aesthetics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
  - Tables automatically convert to card layouts on mobile devices
  - Transaction lists, holdings, and contributions optimized for small screens
  - Breakpoint-aware components (md/lg) for optimal viewing
- **Mobile Navigation**: Sheet component with proper alignment and spacing
- **Consistent Buttons**: Standardized button sizes across all pages
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🔧 Technical Features

#### Architecture & Code Quality

- **DRY Principles**: Centralized authentication, cache management, and validation utilities
- **SOLID Architecture**: Clear separation of concerns with focused, single-responsibility modules
- **Service Layer Pattern**: Business logic abstraction for improved testability and maintainability
- **Shared Utilities**: Reusable helpers for translations, styling, and form validation

#### Performance & Caching

- **Modern Caching**: Next.js 16 Cache Components with `"use cache"` directive for granular caching control
- **Cache Tagging**: `cacheTag()` and `cacheLife()` APIs for flexible cache management and revalidation
- **Immediate Invalidation**: `updateTag()` for read-your-own-writes semantics in server actions
- **Cache Management**: Centralized cache helpers (`src/lib/cache/helpers.ts`) with automatic revalidation
- **Locale-Aware Revalidation**: Cache invalidation works across all locale-prefixed routes (/en, /fr)
- **Production-Ready Caching**: All mutations properly invalidate both specific and dashboard caches for instant updates
- **Service Layer Caching**: Consolidated dashboard data fetching eliminates triple-fetch anti-pattern

#### Authentication & Security

- **Centralized Auth**: Shared authentication utilities (`requireAuth`, `getCurrentUserId`, `redirectIfAuthenticated`)
- **Auth Page Protection**: Logged-in users are automatically redirected from login/signup pages to dashboard
- **Google OAuth + Email/Password**: Via Better Auth with bcrypt password hashing
- **Signup Flow**: Complete registration flow with validation and internationalization
- **Language Picker**: Language selection available on login and signup pages
- **Proper Sign Out**: Authentication state properly cleared with client-side refresh and navigation
- **Security Hardening**: ISIN format validation, URL encoding, proper error handling

#### Forms & Validation

- **Type-Safe Forms**: Zod validation with next-intl integration for internationalized error messages
- **Common Schema Patterns**: Reusable validation utilities (`amountSchema`, `dateSchema`, `positiveNumberSchema`)
- **Number Input Fix**: Union type pattern with `.pipe()` for proper coercion of numeric form fields
- **Server Actions**: Forms use server actions for secure, server-side data mutations with cache invalidation

#### Data & State Management

- **Server Components**: Optimized with React Server Components for better performance
- **Account Service Layer**: Abstracted CRUD operations with `getOrCreate` pattern
- **Dashboard Service**: Single data-fetching service eliminates redundant queries
- **Calculation Utilities**: Centralized business logic in `src/lib/calculations/`
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Parallel Data Fetching**: Optimized API calls with Promise.all for better performance

#### Internationalization & UI

- **Full i18n Coverage**: Complete translations for all pages in English and French
- **Type Translators**: Utility functions replace nested ternaries for cleaner code
- **Styling Helpers**: Centralized color and prefix utilities for consistent UI
- **Charts**: Recharts integration with locale-aware date and currency formatting
- **Modular Components**: Feature components broken down for better separation of concerns

#### Development & Testing

- **Comprehensive Test Utilities**: Mock helpers for auth, database, and translations
- **Unit Test Coverage**: All new utilities and services have dedicated test files
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing, linting, and deployment
- **Git Hooks**: Husky pre-commit hooks with lint-staged for automated code quality checks
- **API Routes**: RESTful API with Next.js route handlers with proper security measures

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query for client-side caching
- **Charts**: Recharts
- **Internationalization**: next-intl
- **State Management**: URL state with nuqs

### Backend

- **Database**: Neon PostgreSQL
- **ORM**: Drizzle
- **Authentication**: Better Auth
- **API**: Next.js API Routes

### Dev Tools

- **Linting**: ESLint + Prettier
- **Testing**: Vitest + Playwright + React Testing Library
- **Git Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/coinjar.git
cd coinjar

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
pnpm db:push

# (Optional) Seed database with mock data
pnpm db:seed

# Start development server
pnpm dev
```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=your_neon_database_url

# Authentication
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cron Jobs (optional, for production)
CRON_SECRET=your_cron_secret_for_scheduled_tasks
```

## 📝 Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio
pnpm db:generate      # Generate migrations
pnpm db:seed          # Seed database with mock data

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm precommit        # Run linting and tests (pre-commit hook)

# Testing
pnpm test             # Run unit tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run E2E tests with UI
```

## 🎯 Project Structure

```
coinjar/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # i18n routes
│   │   │   ├── dashboard/     # Dashboard pages
│   │   │   ├── (auth)/        # Auth pages
│   │   │   └── layout.tsx     # Root layout
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Shadcn UI components
│   │   ├── layout/            # Layout components
│   │   └── animated-wrapper.tsx
│   ├── features/              # Feature modules
│   │   ├── dashboard/         # Dashboard feature
│   │   │   ├── components/    # Dashboard components
│   │   │   ├── calculations.ts # Chart & metrics calculations
│   │   │   ├── services.ts    # Data fetching service
│   │   │   └── queries.ts     # Database queries
│   │   ├── livret-a/          # Livret A feature
│   │   ├── pea/               # PEA feature
│   │   └── pee/               # PEE feature
│   ├── lib/                   # Shared utilities
│   │   ├── auth/              # Authentication utilities
│   │   │   ├── helpers.ts     # Auth helpers (requireAuth, getCurrentUserId)
│   │   │   ├── page-helpers.ts # Page auth utilities
│   │   │   └── index.ts       # Better Auth config
│   │   ├── cache/             # Cache management
│   │   │   ├── tags.ts        # Cache tag definitions
│   │   │   └── helpers.ts     # Cache invalidation helpers
│   │   ├── calculations/      # Business logic
│   │   │   └── index.ts       # Centralized calculation exports
│   │   ├── i18n/              # Internationalization utilities
│   │   │   └── type-translators.ts # Type translation helpers
│   │   ├── services/          # Service layer
│   │   │   └── account-service.ts # Account CRUD operations
│   │   ├── validation/        # Form validation
│   │   │   └── common-schemas.ts # Reusable Zod schemas
│   │   ├── utils/             # General utilities
│   │   │   ├── styling.ts     # UI styling helpers
│   │   │   └── utils.ts       # General helpers
│   │   └── db/                # Database
│   ├── i18n/                  # Internationalization config
│   └── types/                 # TypeScript types
├── messages/                   # Translation files
│   ├── en.json
│   └── fr.json
├── tests/                      # Test files
│   ├── e2e/                   # E2E tests
│   ├── component/             # Component tests
│   ├── unit/                  # Unit tests
│   │   ├── auth-helpers.test.ts
│   │   ├── cache-helpers.test.ts
│   │   ├── type-translators.test.ts
│   │   └── styling-helpers.test.ts
│   └── utils/                 # Test utilities
│       └── test-helpers.ts    # Mock helpers
└── public/                    # Static assets
```

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Core business logic, utilities, calculations, and security validations
- **Component Tests**: React component testing with RTL including skeleton components
- **E2E Tests**: End-to-end user flows with Playwright for all major pages

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test              # Unit and component tests
pnpm test:ui           # Tests with UI viewer
pnpm test:coverage     # Generate coverage report
pnpm test:e2e          # E2E tests with Playwright
pnpm test:e2e:ui       # E2E tests with UI
```

### Test Coverage

Tests include:

- Livret A calculations and transactions
- PEA portfolio metrics and ISIN validation
- PEE contribution calculations
- Security validations (ISIN format, URL encoding)
- Skeleton loading components
- E2E flows for all account pages with locale handling
- Authentication redirects and protected routes
- Multi-language support verification

All E2E tests have been updated to properly handle:

- Locale-prefixed routes (`/en/` and `/fr/`)
- Authentication state and redirects
- Translation-aware content verification

## 🌐 Internationalization

The app supports multiple languages through next-intl:

- English (en)
- French (fr)

Translations are stored in `messages/` directory. Form validation errors are also fully internationalized using custom Zod error maps.

## 🎨 Theming

The application features a strong green-themed design system with:

- Primary: Green (#22C55E variants)
- Dark mode support
- Custom Outfit font
- Consistent spacing and border radius
- CSS variables for easy customization

Edit `src/app/globals.css` to customize the theme.

### Advanced Caching System

The application implements Next.js 16's Cache Components feature with the `"use cache"` directive:

**Data Layer Caching**:

- All database queries use `"use cache"` directive for explicit caching control
- `cacheTag()` for on-demand cache invalidation with user-scoped tags
- `cacheLife()` for configurable cache expiration (using named profiles like `'hours'` or custom durations)
- Consistent caching strategy across all features (dashboard, livret-a, pea, pee)
- Centralized cache tag management in `src/lib/cache/tags.ts`
- Each business entity has dedicated cache tags per user for granular control

**Cache Invalidation**:

- Server actions use `updateTag()` for immediate cache invalidation (read-your-own-writes)
- Client components call `router.refresh()` after mutations for immediate UI updates
- Dashboard cache automatically invalidated when any account is modified
- Locale-aware path revalidation works across all locale routes (/en, /fr)
- Both tag-based and path-based revalidation ensure comprehensive cache coverage

**Configuration**:

```typescript
// Example: PEA data with 1-hour cache
export async function getPeaAccountByUserId(userId: string) {
	'use cache'
	cacheTag(getCacheTag.pea(userId))
	cacheLife('hours')

	return db.query.peaAccounts.findFirst({
		where: eq(peaAccounts.userId, userId),
		with: { holdings: true },
	})
}

// Cache invalidation in server actions
export async function addHolding(data: PeaHoldingInput) {
	'use server'
	const userId = await requireAuth()
	// ... mutation logic ...
	updateTag(getCacheTag.pea(userId))
}
```

This ensures:

- No unnecessary refetching on every page visit
- Instant updates after mutations with read-your-own-writes semantics
- Reduced database load
- Better performance and user experience
- Explicit caching boundaries for better control

### Skeleton Loading States

All pages implement comprehensive skeleton loading states that mirror the actual content structure:

- Dashboard overview and account cards
- Livret A transaction lists
- PEA holdings table
- PEE contribution breakdowns

This provides a smooth, professional UX during data loading.

### ISIN Validation

When adding securities to your PEA, the app automatically validates ISINs against Yahoo Finance using TanStack Query:

- **Query caching** - Validated ISINs are cached to avoid redundant API calls
- **Debounced requests** (500ms) to avoid excessive API calls
- **Real-time format validation** with regex pattern matching
- **Error handling** - Automatic retry logic and error states
- **Proper URL encoding** for security
- **Auto-filling** security names from API response
- **Stale-while-revalidate** pattern for optimal UX

This provides a smoother experience with intelligent caching and automatic error recovery.

### Database Seeding

The project includes a comprehensive seed script that:

- Creates a mock user with email/password authentication
- Populates Livret A with sample transactions
- Adds PEA holdings with realistic ETF data
- Seeds PEE contributions across different types
- Uses bcryptjs for secure password hashing (matches Better Auth configuration)

Run `pnpm db:seed` to populate your development database with realistic test data.

**Mock credentials after seeding:**

- Email: `mock@example.com`
- Password: `Password123!`

**Note**: Better Auth is configured to use bcrypt for password hashing and verification, ensuring compatibility with the seed script.

### Form Handling

All forms use modern best practices:

- **Zod schemas** with factory functions that accept translation functions from next-intl
- **Union type pattern** (`z.union([z.string(), z.number()]).pipe()`) for proper type coercion of number inputs
- **React Hook Form state** - `form.formState.isSubmitting` replaces manual loading states for better precision
- **Server actions** for form submissions, ensuring secure server-side processing
- **Fully localized error messages** through next-intl integration with no hardcoded strings
- **TanStack Query** for client-side data fetching with built-in caching and error handling

This pattern solves common issues with HTML number inputs returning strings while maintaining full TypeScript type safety and eliminating the anti-pattern of locale-based conditional rendering.

### Dashboard Charts

The dashboard features:

- Wealth evolution area chart
- Asset allocation pie chart
- Performance metrics bar chart
- Mock historical data for visualization

### Database Schema

The app uses a normalized PostgreSQL schema with:

- Users and authentication tables (Better Auth)
- Livret A accounts and transactions
- PEA accounts and holdings
- PEE accounts and contributions
- ETF price cache for performance optimization

### Security Features

The application implements several security best practices:

- **Authentication**: Both OAuth and email/password support
- **Authorization**: All server actions verify user ownership
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection Prevention**: Drizzle ORM with parameterized queries
- **XSS Prevention**: React auto-escaping
- **ISIN Format Validation**: Regex pattern matching to prevent malicious input
- **URL Encoding**: Proper encoding for external API calls
- **CSRF Protection**: Built into Better Auth
- **Password Hashing**: bcryptjs with proper salt rounds

See `SECURITY_AUDIT.md` for detailed security analysis and recommendations.

## 🚀 CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline using GitHub Actions that automatically runs on every push and pull request:

### Pipeline Stages

1. **Linting**: Runs ESLint to check code quality (continues on error)
2. **Unit Tests**: Executes Vitest unit tests (continues on error)
3. **E2E Tests**: Runs Playwright end-to-end tests (continues on error)
4. **Deployment**: Deploys to Vercel on successful main branch pushes

### GitHub Actions Workflow

The workflow is configured to:

- Run on `main` and `develop` branch pushes
- Run on pull requests targeting `main`
- Use `continue-on-error: true` for test stages to prevent blocking deployment
- Upload Playwright test reports as artifacts (retained for 30 days)
- Automatically deploy to Vercel production on main branch

### Required Secrets

To enable deployment, add these secrets to your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID (optional)
- `VERCEL_PROJECT_ID`: Your Vercel project ID (optional)

### Pre-commit Hooks

The project uses Husky and lint-staged to enforce code quality:

- **Husky**: Git hooks manager
- **lint-staged**: Runs linters on staged files only
- **Pre-commit hook**: Automatically runs ESLint, Prettier, and tests on staged files

When you commit:

1. ESLint fixes linting issues automatically
2. Prettier formats code
3. Unit tests run (if test files are staged)
4. Commit proceeds if all checks pass

### Manual Workflow Trigger

You can manually trigger the workflow from the GitHub Actions tab.

## 🤝 Contributing

Contributions are welcome! Please follow the code style guidelines:

- Use tabs for indentation
- Follow the project's ESLint and Prettier configs
- Write tests for new features
- Update documentation as needed
- Pre-commit hooks will automatically check your code before committing

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://better-auth.com/)

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ and modern web technologies
