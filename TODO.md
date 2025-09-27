# HelloSleep Development TODO

## ✅ Completed Tasks

### Monorepo Setup
- [x] Restructure project into monorepo (service/, web/, shared/)
- [x] Set up npm workspaces
- [x] Configure root package.json with concurrent scripts
- [x] Move Strapi backend to service/ folder
- [x] Create Next.js frontend in web/ folder
- [x] Create shared/ package for common utilities
- [x] Update README.md with monorepo documentation

### Shared Package
- [x] Create shared/ package with TypeScript configuration
- [x] Define common types and interfaces
- [x] Create Axios-based API client
- [x] Build and integrate shared package with web frontend

### Frontend Foundation
- [x] Set up Next.js 15.4.5 with App Router
- [x] Configure Tailwind CSS for styling
- [x] Create basic layout components (Header, Footer, Layout)
- [x] Implement responsive navigation
- [x] Add ferry image and animation

### Internationalization (i18n)
- [x] Implement i18n using Next.js middleware approach
- [x] Create translation system with Chinese and English
- [x] Set up dynamic routing with [locale] structure
- [x] Configure Chinese as default (no prefix) and English with /en prefix
- [x] Create useTranslation hook for language switching
- [x] Update all components and pages to use translations
- [x] Add language switcher in header
- [x] Implement localized navigation links

### Content and Pages
- [x] Create homepage with hero section and philosophy
- [x] Build help guide page with comprehensive 5-step content
- [x] Create placeholder pages for all sections (tutorial, share, blog, assessment)
- [x] Add ferry metaphor and visual elements
- [x] Implement responsive design for all pages

### Design and Prototyping
- [x] Create static HTML prototype for design review
- [x] Incorporate unique sleep philosophy and ferry metaphor
- [x] Design approval and transition to full React app
- [x] Implement modern, clean UI with Tailwind CSS

### Branding and Assets
- [x] Add logo to header (80x80px)
- [x] Remove duplicate brand text from header
- [x] Fix language switching functionality

### Article System Implementation ✅
- [x] **API Integration Setup**
  - [x] Create API client for Strapi backend
  - [x] Set up environment variables for API endpoints
  - [x] Create TypeScript interfaces for Article and Category types

- [x] **Article Types & Data Structure**
  - [x] Define Article interface with `type` field ('tutorial' or 'share')
  - [x] Separate tutorials from shared articles using `type` field
  - [x] Create Category interface with `weight` field for sorting

- [x] **Tutorial Page Implementation**
  - [x] Fetch categories from `/api/categories` (sorted by weight)
  - [x] Fetch tutorials from `/api/articles` (filtered by `type: 'tutorial'`)
  - [x] Group tutorials by category
  - [x] Create tutorial listing page with category navigation
  - [x] Handle API authentication with bearer token
  - [x] Fix data structure handling (direct properties vs attributes)
  - [x] Add error handling and loading states

- [x] **Shared Articles Page Implementation**
  - [x] Fetch shared articles from `/api/articles` (filtered by `type: 'share'`)
  - [x] Create shared articles listing page
  - [x] Add proper error handling and loading states

- [x] **Navigation Updates**
  - [x] Update navigation to point to correct tutorial and sharing pages
  - [x] Ensure i18n support for new article pages
  - [x] Add category filtering functionality

- [x] **URL-Based Category Routing**
  - [x] Implement dynamic routes for category pages (`/tutorial/[category]`)
  - [x] Add category key-based URL navigation
  - [x] Create category-specific tutorial pages
  - [x] Update middleware to handle category routes
  - [x] Implement URL-based state management (no local state)
  - [x] Add proper category navigation with active states

### Frontend-Backend Integration ✅
- [x] Connect web frontend to Strapi API
- [x] Implement API client for article fetching
- [x] Add real data integration
- [x] Handle loading states and error boundaries
- [x] Fix API authentication issues
- [x] Resolve data structure mismatches

## 🔄 In Progress

### Tutorial System Issues
- [ ] **Route Conflict Resolution**
  - [ ] Fix route conflict between /tutorial/[altId] and /tutorial/[category]
  - [ ] Test tutorial redirects work correctly after fixing route conflict
  - [ ] Ensure backward compatibility for old tutorial links

### Frontend Routing & Navigation
- [x] Test and verify category URL routing functionality
- [x] Ensure proper category linking between articles and categories
- [ ] Add breadcrumb navigation for category pages

### Assessment System ✅
- [x] Complete sleep assessment implementation with wireframe design
- [x] Remove wireframe reference page (cleanup completed)
- [x] **Static Assessment System**
  - [x] Create static assessment engine with rule-based calculations
  - [x] Implement comprehensive tag and booklet mapping
  - [x] Build HelloSleep methodology-compliant content
  - [x] Add 15 booklets covering all assessment scenarios
  - [x] Create comprehensive documentation and usage examples
- [x] **Assessment Validation System**
  - [x] Implement comprehensive test framework with 16 scenarios
  - [x] Create tag calculation validation and booklet matching tests
  - [x] Build assessment flow testing utilities
  - [x] Add detailed test reporting and analysis
  - [x] Create production readiness assessment
  - [x] Implement continuous testing framework
  - [x] Add comprehensive documentation and validation guide
- [x] **Update Assessment Result Page**
  - [x] Integrate static assessment engine
  - [x] Display rule-based recommendations with tag matching
  - [x] Show booklet recommendations with HelloSleep methodology
  - [x] Add loading states and processing indicators
  - [x] Display assessment insights and primary issues
  - [x] Show detailed action items with difficulty levels
  - [x] Add test mode with prefill data for easy testing
- [x] **Assessment Internationalization & UI**
  - [x] Implement proper URL routing for Chinese and English assessments
  - [x] Add comprehensive translation system for assessment interface
  - [x] Create `/assessment` → `/zh/assessment` default redirect
  - [x] Support `/en/assessment` for English version
  - [x] Fully internationalize assessment page with translation keys
  - [x] Remove assessment categories section for cleaner UI
  - [x] Update middleware to handle locale-specific routing
- [x] Test assessment flow end-to-end
- [x] Validate static assessment algorithms
- [x] Configure assessment system and test integration
- [x] **Assessment System Refactoring**
  - [x] Unified tag and booklet facts into single StaticTag structure
  - [x] Removed redundant id and interventions fields from tags
  - [x] Integrated recommendation content directly into tags
  - [x] Updated assessment engine to use unified tag-based recommendations
  - [x] Modified API responses to return full Tag objects with recommendations
  - [x] Updated UI components to display recommendations from tags
  - [x] Removed old booklet matching system and assessment-booklets-mapping.ts
  - [x] Cleaned up migration-related pages and models
- [x] **Tutorial Link System**
  - [x] Created API proxy for articles to avoid CORS issues
  - [x] Added /tutorial/[altId] redirect route for backward compatibility
  - [x] Updated all 15 tutorial links from /tutorial/{altId} to /article/{documentId}
  - [x] Mapped altId to documentId using Strapi database lookup
  - [x] Assessment recommendations now link directly to correct article pages

## 📋 Next Priority Tasks

### Content Management ✅
- [x] **Article Migration System**
  - [x] Create comprehensive migration scripts and documentation
  - [x] Successfully migrate 155/158 articles (97.8% success rate)
  - [x] Fix format field validation errors in Lexical JSON
  - [x] Implement UID-based category linking system
  - [x] Resolve image structure issues in Strapi 5
  - [x] Create migration guide and documentation
  - [x] Clean up and organize migration scripts
  - [x] Document failed articles for future resolution

- [ ] **Content Workflows**
  - [ ] Set up content approval workflows
  - [ ] Implement content versioning
  - [ ] Add content scheduling features

### User Experience
- [x] **Sleep Assessment Tool Implementation**
  - [x] Design comprehensive UX wireframes for assessment flow
  - [x] Create assessment data structure with 31 questions across 5 sections
  - [x] Implement AssessmentEngine with scoring and recommendation logic
  - [x] Build interactive assessment page with navigation tabs
  - [x] Integrate real Strapi 3 assessment data
  - [x] Create landing, questions, and results screens
  - [x] Add progress tracking and dynamic question flow
  - [x] Implement responsive design with Tailwind CSS
  - [x] Set up proper routing with redirect from /assessment to /zh/assessment
  - [x] Implement internationalization for Chinese and English interfaces
- [ ] Add user authentication system
- [ ] Create user profiles and preferences
- [ ] Add article bookmarking and favorites
- [ ] Implement personalized recommendations

### Technical Improvements
- [ ] Set up proper TypeScript types for all components
- [ ] Add error boundaries and loading states
- [ ] Implement SEO optimization
- [ ] Add analytics and monitoring
- [ ] Configure production environment

## 🚀 Future Development

### Content Migration
- [ ] Migrate existing Gatsby content to Next.js
- [ ] Preserve existing URLs and SEO
- [ ] Update content to reflect new design
- [ ] Add new content based on user feedback

### Advanced Features
- [ ] Build mobile app (React Native)
- [ ] Implement push notifications
- [ ] Add community features (comments, likes)
- [ ] Create newsletter subscription system
- [ ] Add advanced search and filtering

### Performance & Optimization
- [ ] Implement image optimization
- [ ] Add caching strategies
- [ ] Optimize bundle size
- [ ] Set up CDN for static assets
- [ ] Implement progressive web app features

### DevOps & Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure staging environment
- [ ] Implement automated testing
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

## 🐛 Known Issues

### Critical
- [x] Strapi backend not starting due to PostgreSQL auth issue
- [ ] External images not displaying in Strapi admin
- [x] Category linking not working (tutorials show category: null) - **RESOLVED**: Strapi 5 uses `documentId` instead of `id` for relations
- [ ] 3 articles failed to import due to invalid internal links - **DOCUMENTED**: See `service/script/FAILED_ARTICLES.md`

### Minor
- [ ] Some navigation links may not be properly localized
- [ ] Need to add loading states for better UX
- [ ] Mobile menu needs testing and refinement

## 📝 Notes

- **Current Focus**: Content management and user experience features
- **Next Sprint**: Backend database setup and content migration
- **Architecture**: Monorepo with Strapi backend, Next.js frontend, shared utilities
- **Design Philosophy**: Life-based approach to insomnia, community-focused, ferry metaphor
- **Tech Stack**: Next.js 15, Tailwind CSS, TypeScript, Strapi 4, PostgreSQL
- **Article System**: Two types - tutorials (type: 'tutorial') and shared articles (type: 'share')
- **Category System**: Weight-based sorting for tutorial categories
- **Recent Achievement**: Successfully implemented URL-based category routing system and completed comprehensive article migration (155/158 articles) with full documentation
- **Critical Discovery**: Strapi 5 API structure fundamentally different from Strapi 4 - uses `documentId` for relations and data not nested under `attributes`
- **Frontend Fix**: Resolved category filtering issue by fixing nested filter parameter handling in API client
- **Assessment Milestone**: Completed full sleep assessment implementation with wireframe design, interactive navigation, and real data integration
- **AI Enhancement**: Implemented AI-powered recommendation system replacing hard-coded calculations with dynamic, personalized suggestions
- **Cost Optimization**: Created AI training data system with pattern matching and caching, reducing AI API calls by 90%+ while maintaining quality
- **Assessment Refactoring**: Successfully unified tag and booklet facts into single StaticTag structure, removing redundant fields and simplifying the recommendation system
- **Tutorial Link Migration**: Updated all assessment tutorial links from /tutorial/{altId} to /article/{documentId} format, with API proxy for CORS handling and backward compatibility redirect route 