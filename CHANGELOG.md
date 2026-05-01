# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-15

### Added
- Comprehensive component test suite with 6+ unit tests (@testing-library/react)
- Test coverage reporting with vitest and codecov integration
- CI pipeline automation for E2E tests with Playwright
- Error Boundary component for production error handling
- Skip-to-content accessibility link for keyboard navigation
- Proper SEO metadata with real domain URLs
- Security contact information in SECURITY.md

### Changed
- Updated package.json with `test:coverage` scripts across all packages
- Enhanced CI/CD pipeline (.github/workflows/ci.yml) with coverage and E2E test steps
- Improved error handling in App.tsx with React Error Boundary
- Updated Open Graph meta tags with production URL
- Enhanced sitemap.xml and robots.txt with real domain

### Fixed
- Example.com placeholders replaced with production URL
- Accessibility improvements in Layout component

## [0.1.0] - 2025-01-01

### Added
- Initial release of The People's Election Guide
- Comprehensive election information platform for Indian citizens
- Interactive Quiz component with 7+ questions
- Timeline page with election process visualization
- How to Vote guide with step-by-step instructions
- Your Rights section covering voter protections
- Ask The Guide AI-powered Q&A interface
- Responsive design with mobile-first approach
- Tailwind CSS styling with custom theming
- Dark mode support with next-themes
- PWA capabilities with offline support
- Accessible component library (Radix UI)
- Animation effects with Framer Motion
- Form handling with React Hook Form and Zod validation

### Features
- **Nonpartisan Content**: Neutral, fact-based information on elections
- **Accessibility**: WCAG compliant with screen reader support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Performance**: Optimized with Vite and code splitting
- **SEO Optimized**: Meta tags, sitemap, and structured data
- **Offline Support**: Service worker for offline functionality

### Technical Stack
- React 18+ with TypeScript
- Vite for build tooling
- Vitest for unit testing
- Playwright for E2E testing
- TailwindCSS for styling
- Framer Motion for animations
- Zod for schema validation
- React Query for state management
- Wouter for routing

---

## Development

For detailed development information, see [CONTRIBUTING.md](./CONTRIBUTING.md).

For security concerns, see [SECURITY.md](./SECURITY.md).
