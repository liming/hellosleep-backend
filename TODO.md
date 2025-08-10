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

### Frontend-Backend Integration ✅
- [x] Connect web frontend to Strapi API
- [x] Implement API client for article fetching
- [x] Add real data integration
- [x] Handle loading states and error boundaries
- [x] Fix API authentication issues
- [x] Resolve data structure mismatches

## 🔄 In Progress

### Backend Issues
- [x] Fix Strapi PostgreSQL authentication issue
- [x] Configure environment variables properly
- [x] Resolve database connection permissions

## 📋 Next Priority Tasks

### Content Management
- [ ] Migrate existing articles from remote server
- [ ] Import articles into Strapi with proper formatting
- [ ] Fix image display issues in rich text editor
- [ ] Set up content workflows

### User Experience
- [ ] Implement sleep assessment tool
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
- [ ] Strapi backend not starting due to PostgreSQL auth issue
- [ ] External images not displaying in Strapi admin

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
- **Recent Achievement**: Successfully integrated frontend with Strapi API, displaying real articles with proper error handling 