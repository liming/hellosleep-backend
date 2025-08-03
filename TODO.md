# HelloSleep Development TODO

## 🎯 **Project Overview**
- **Goal**: Migrate from Gatsby to Next.js with new features
- **Approach**: Build new web app with modern architecture, gradually migrate content
- **Backend**: Strapi API for content management
- **Frontend**: Next.js with TypeScript and Tailwind CSS

---

## 📋 **Phase 1: Foundation & Setup** ✅ *In Progress*

### ✅ **Completed**
- [x] Set up monorepo structure
- [x] Move Strapi backend to `service/` folder
- [x] Create Next.js web frontend
- [x] Configure workspace management
- [x] Set up development scripts

### 🔄 **In Progress**
- [x] Fix Strapi database connection (PostgreSQL auth issue) ✅
- [ ] Set up shared types between frontend and backend
- [ ] Configure environment variables for development

### ⏳ **Next Steps**
- [ ] Set up API client for frontend-backend communication
- [ ] Create basic layout and navigation structure
- [ ] Set up authentication system
- [ ] Configure Tailwind CSS theme and design system

---

## 📋 **Phase 2: Content Migration & API Integration**

### **Backend API Development**
- [ ] **Article Management**
  - [ ] Complete article migration scripts (fix image issues)
  - [ ] Set up article categories and tags
  - [ ] Add article search and filtering
  - [ ] Implement article pagination
  - [ ] Add article metadata (reading time, difficulty level)

- [ ] **User Management**
  - [ ] Set up user authentication (JWT)
  - [ ] Add user profiles and preferences
  - [ ] Implement user bookmarks/favorites
  - [ ] Add user reading progress tracking

- [ ] **Assessment System**
  - [ ] Design insomnia assessment data model
  - [ ] Create assessment questions and scoring
  - [ ] Implement assessment results storage
  - [ ] Add assessment history and trends

### **Frontend Development**
- [ ] **Core Pages**
  - [ ] Homepage with featured articles
  - [ ] Article listing page with filters
  - [ ] Article detail page with rich content
  - [ ] User dashboard/profile page
  - [ ] About and contact pages

- [ ] **Components**
  - [ ] Navigation header and footer
  - [ ] Article card component
  - [ ] Rich text content renderer
  - [ ] Search and filter components
  - [ ] User authentication forms
  - [ ] Loading and error states

- [ ] **Assessment App**
  - [ ] Assessment questionnaire interface
  - [ ] Progress tracking and results display
  - [ ] Assessment history and recommendations
  - [ ] Export/share assessment results

---

## 📋 **Phase 3: Enhanced Features**

### **Content Features**
- [ ] **Article Enhancements**
  - [ ] Add article comments and discussions
  - [ ] Implement article sharing functionality
  - [ ] Add related articles suggestions
  - [ ] Create article reading lists/collections
  - [ ] Add article bookmarking and notes

- [ ] **Search & Discovery**
  - [ ] Implement full-text search
  - [ ] Add search filters (category, difficulty, reading time)
  - [ ] Create personalized article recommendations
  - [ ] Add trending and popular articles

### **User Experience**
- [ ] **Personalization**
  - [ ] User reading preferences and history
  - [ ] Personalized content recommendations
  - [ ] Reading progress tracking
  - [ ] Customizable dashboard

- [ ] **Mobile Optimization**
  - [ ] Responsive design for mobile devices
  - [ ] Progressive Web App (PWA) features
  - [ ] Offline reading capabilities
  - [ ] Touch-friendly interactions

---

## 📋 **Phase 4: Advanced Features**

### **Assessment & Analytics**
- [ ] **Enhanced Assessment**
  - [ ] Multiple assessment types (sleep quality, insomnia severity)
  - [ ] Detailed assessment reports with charts
  - [ ] Progress tracking over time
  - [ ] Personalized recommendations based on results
  - [ ] Export assessment data (PDF, CSV)

- [ ] **Analytics & Insights**
  - [ ] User behavior analytics
  - [ ] Content performance metrics
  - [ ] Assessment result analytics
  - [ ] A/B testing for content optimization

### **Content Management**
- [ ] **Admin Features**
  - [ ] Content editor for articles
  - [ ] Assessment question management
  - [ ] User management dashboard
  - [ ] Analytics and reporting tools

- [ ] **SEO & Performance**
  - [ ] SEO optimization for articles
  - [ ] Meta tags and structured data
  - [ ] Performance optimization
  - [ ] CDN integration for assets

---

## 📋 **Phase 5: Migration & Deployment**

### **Content Migration**
- [ ] **From Gatsby Site**
  - [ ] Audit existing content and features
  - [ ] Migrate essential articles and pages
  - [ ] Preserve SEO rankings and redirects
  - [ ] Test content rendering and functionality

- [ ] **From Insomnia Assessment App**
  - [ ] Analyze existing assessment logic
  - [ ] Migrate assessment questions and scoring
  - [ ] Preserve user assessment data
  - [ ] Test assessment functionality

### **Deployment & Infrastructure**
- [ ] **Production Setup**
  - [ ] Set up production database
  - [ ] Configure production environment variables
  - [ ] Set up CI/CD pipeline
  - [ ] Configure monitoring and logging

- [ ] **Performance & Security**
  - [ ] Security audit and hardening
  - [ ] Performance optimization
  - [ ] Backup and disaster recovery
  - [ ] SSL and security headers

---

## 🎯 **Priority Matrix**

### **High Priority (Phase 1-2)**
1. Fix Strapi database connection
2. Set up basic API integration
3. Create core article pages
4. Implement user authentication
5. Build assessment questionnaire

### **Medium Priority (Phase 3)**
1. Enhanced article features
2. Search and filtering
3. Mobile optimization
4. User personalization

### **Low Priority (Phase 4-5)**
1. Advanced analytics
2. Content migration from Gatsby
3. Performance optimization
4. Advanced admin features

---

## 📝 **Notes & Considerations**

### **Technical Decisions**
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + Zustand (if needed)
- **API**: Strapi REST API with custom endpoints
- **Database**: PostgreSQL for production, SQLite for development

### **Design Principles**
- **Mobile-first**: Responsive design for all screen sizes
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast loading times and smooth interactions
- **User-centered**: Focus on user needs and pain points

### **Content Strategy**
- **Quality over quantity**: Focus on high-value, actionable content
- **Progressive disclosure**: Show relevant content based on user journey
- **Personalization**: Tailor content to user preferences and history
- **Engagement**: Encourage user interaction and feedback

---

## 🚀 **Getting Started**

### **Immediate Next Steps**
1. ✅ Fix Strapi database connection issue
2. Set up shared TypeScript types
3. Create basic Next.js layout and navigation
4. Implement API client for Strapi communication
5. Build article listing and detail pages

### **Development Workflow**
- Use `npm run dev` to start both services
- Use `npm run dev:service` for backend development
- Use `npm run dev:web` for frontend development
- Use shared types for API communication
- Follow component-driven development approach

---

*Last updated: August 3, 2025* 