# CoinJar - Savings Tracker

A modern, full-stack web application for tracking and managing your French savings accounts (Livret A, PEA, and PEE) with beautiful visualizations and comprehensive portfolio management.

## 🚀 Features

### ✨ Core Functionality

- **Dashboard with Analytics**: Visual wealth evolution tracking with interactive charts
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
- **Mobile Navigation**: Sheet component for responsive mobile menu
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🔧 Technical Features

- **Advanced Caching**: Next.js 16 `unstable_cache` with granular tag-based invalidation using `revalidateTag`
- **Cache Management**: Centralized cache tags system with automatic revalidation on mutations
- **Locale-Aware Revalidation**: Cache invalidation works across all locale-prefixed routes (/en, /fr)
- **Production-Ready Caching**: All mutations properly invalidate both specific and dashboard caches for instant updates
- **Type-Safe Forms**: Zod validation with next-intl integration for internationalized error messages
- **Number Input Fix**: Union type pattern with `.pipe()` for proper coercion of numeric form fields
- **Server Actions**: Forms use server actions for secure, server-side data mutations with cache invalidation
- **Server Components**: Optimized with React Server Components for better performance
- **Authentication**: Google OAuth + Email/Password via Better Auth with bcrypt password hashing
- **Proper Sign Out**: Authentication state properly cleared with client-side refresh and navigation
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Charts**: Recharts integration with locale-aware date and currency formatting
- **API Routes**: RESTful API with Next.js route handlers with proper security measures
- **Optimistic Updates**: Fast UI with progressive enhancement and proper cache management
- **Parallel Data Fetching**: Optimized API calls with Promise.all for better performance
- **Security Hardening**: ISIN format validation, URL encoding, proper error handling
- **Full i18n Coverage**: Complete translations for all pages (dashboard, livret-a, pea, pee, login) in English and French
- **Modular Components**: Feature components broken down for better separation of concerns and maintainability

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
- **Git Hooks**: Husky
- **Package Manager**: pnpm

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
│   │   ├── livret-a/          # Livret A feature
│   │   ├── pea/               # PEA feature
│   │   └── pee/               # PEE feature
│   ├── lib/                   # Utilities
│   │   ├── auth/              # Authentication
│   │   ├── db/                # Database
│   │   ├── zod-i18n.ts        # Zod i18n helper
│   │   └── utils.ts           # Utility functions
│   ├── i18n/                  # Internationalization
│   └── types/                 # TypeScript types
├── messages/                   # Translation files
│   ├── en.json
│   └── fr.json
├── tests/                      # Test files
│   ├── e2e/                   # E2E tests
│   ├── component/             # Component tests
│   └── unit/                  # Unit tests
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

## 📊 Features Deep Dive

### Production-Ready Enhancements

Recent improvements for production deployment:

**Cache Invalidation**:

- All mutations (Livret A transactions, PEA holdings, PEE contributions) properly invalidate dashboard cache
- Client-side cache refresh (`router.refresh()`) added to all form submissions for instant UI updates
- Server-side cache invalidation using `revalidateTag` and `revalidatePath` for comprehensive coverage
- Corrected revalidation API syntax for Next.js 16 compatibility

**Authentication Flow**:

- Sign out now properly redirects to login page and refreshes authentication state
- Uses locale-aware router for seamless experience across languages

**Internationalization**:

- Chart date and currency formatting now respects selected locale (English/French)
- Wealth evolution chart displays months in correct language
- All UI elements fully translated

**Component Architecture**:

- Large page components refactored into smaller, focused components:
  - `PeaMetricsCards`: Displays PEA portfolio metrics
  - `PeaHoldingsTable`: Reusable holdings table component
  - `PeeMetricsCards`: PEE account summary cards
  - `PeeContributionBreakdown`: Contribution type breakdown
  - `PeeContributionList`: Recent contributions display
- Better separation of concerns and code reusability
- Easier testing and maintenance

**UI Consistency**:

- Standardized spacing across all pages (`space-y-sm`)
- Language picker properly dismisses after selection using `onSelect` event handler
- Controlled dropdown state prevents UI glitches and duplicate rendering issues

### Advanced Caching System

The application implements Next.js 16's latest caching best practices:

**Data Layer Caching**:

- All database queries use `unstable_cache` with proper cache keys and tags
- Consistent caching strategy across all features (dashboard, livret-a, pea, pee)
- Centralized cache tag management in `src/lib/cache/tags.ts`
- Each business entity has dedicated cache tags per user for granular control

**Cache Invalidation**:

- Server actions use `revalidateTag` for granular cache invalidation
- Client components call `router.refresh()` after mutations for immediate UI updates
- Dashboard cache automatically invalidated when any account is modified
- Locale-aware path revalidation works across all locale routes (/en, /fr)
- Both tag-based and path-based revalidation ensure comprehensive cache coverage

**Configuration**:

```typescript
// Example: PEA data with 1-hour cache
const getCachedPea = unstable_cache(
	async () => fetchPeaData(userId),
	['pea', userId],
	{
		tags: [getCacheTag.pea(userId)],
		revalidate: 3600, // 1 hour
	}
)
```

This ensures:

- No unnecessary refetching on every page visit
- Instant updates after mutations
- Reduced database load
- Better performance and user experience

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

## 🤝 Contributing

Contributions are welcome! Please follow the code style guidelines:

- Use tabs for indentation
- Follow the project's ESLint and Prettier configs
- Write tests for new features
- Update documentation as needed

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
