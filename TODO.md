# HelloSleep Development TODO

## 📋 **Phase 1: Foundation & Setup** ✅ *Completed*

### ✅ **Completed**
- [x] Set up monorepo structure
- [x] Move Strapi backend to `service/` folder
- [x] Create Next.js web frontend
- [x] Configure workspace management
- [x] Set up development scripts
- [x] Fix Strapi database connection (PostgreSQL auth issue) ✅
- [x] Set up shared types between frontend and backend ✅
- [x] Create basic layout and navigation structure ✅
- [x] Build shared package with TypeScript types and API client ✅
- [x] Create landing page with hero section and features ✅
- [x] Set up basic page structure (articles, assessment, about) ✅
- [x] Implement internationalization (i18n) with Chinese and English ✅
- [x] Add language switcher in header ✅

### 🔄 **In Progress**
- [ ] Configure environment variables for development
- [ ] Implement API client for frontend-backend communication

### ⏳ **Next Steps**
- [ ] Connect web frontend to Strapi API
- [ ] Build article listing and detail pages
- [ ] Set up authentication system
- [ ] Configure Tailwind CSS theme and design system

---

## 📋 **Phase 2: Content Migration & API Integration** 🎯 *Current Priority*

### 🔄 **In Progress**
- [ ] Fix Strapi backend startup (database connection)
- [ ] Test API client with Strapi
- [ ] Import migrated articles to Strapi

### ⏳ **Next Steps**
- [ ] Build article listing page with real data
- [ ] Create article detail page with rich content
- [ ] Implement search and filtering for articles
- [ ] Add pagination for article lists
- [ ] Set up image handling for articles

---

## 📋 **Phase 3: Enhanced Features**

### ⏳ **Planned**
- [ ] Build sleep assessment tool
- [ ] Create user authentication system
- [ ] Add user profiles and preferences
- [ ] Implement personalized recommendations
- [ ] Add article bookmarking and favorites
- [ ] Create newsletter subscription

---

## 📋 **Phase 4: Advanced Features**

### ⏳ **Planned**
- [ ] Sleep tracking integration
- [ ] Advanced analytics and insights
- [ ] Mobile app development
- [ ] Social features and community
- [ ] Expert consultation booking
- [ ] Integration with health devices

---

## 📋 **Phase 5: Migration & Deployment**

### ⏳ **Planned**
- [ ] Migrate existing Gatsby content
- [ ] Set up production environment
- [ ] Configure CI/CD pipeline
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics and monitoring

---

## 🎯 **Priority Matrix**

### **High Priority (Phase 1-2)**
1. ✅ Fix Strapi database connection issue
2. ✅ Set up shared TypeScript types
3. ✅ Create basic Next.js layout and navigation
4. ✅ Implement internationalization (i18n)
5. 🔄 Implement API client for Strapi communication
6. 🔄 Build article listing and detail pages

### **Medium Priority (Phase 2-3)**
1. Set up authentication system
2. Build sleep assessment tool
3. Configure Tailwind CSS theme
4. Add search and filtering
5. Implement user profiles

### **Low Priority (Phase 4-5)**
1. Mobile app development
2. Advanced analytics
3. Social features
4. Health device integration

---

## 🛠 **Technical Notes**

### **Current Stack**
- **Backend**: Strapi 4.25.23 with PostgreSQL
- **Frontend**: Next.js 15.4.5 with TypeScript and Tailwind CSS
- **Shared**: TypeScript types and Axios API client
- **Package Manager**: npm with workspaces
- **Internationalization**: Next.js i18n with Chinese (default) and English

### **Development Environment**
- **Web App**: Running on http://localhost:3000 ✅
- **Strapi Backend**: Database connection issue (PostgreSQL auth)
- **Shared Package**: Built and integrated ✅
- **i18n**: Implemented with language switcher ✅

### **File Structure**
```
hellosleep-backend/
├── service/          # Strapi backend
├── web/             # Next.js frontend
│   ├── src/
│   │   ├── app/     # App router pages
│   │   ├── components/layout/  # Header, Footer, Layout
│   │   ├── hooks/   # useTranslation hook
│   │   └── lib/     # translations.ts
│   └── next.config.ts  # i18n configuration
├── shared/          # Shared types and API client
└── TODO.md          # This file
```

---

## 🚀 **Immediate Next Steps**

1. **Fix Strapi Backend**: Resolve PostgreSQL authentication issue
2. **Test API Integration**: Connect web frontend to Strapi API
3. **Build Article Pages**: Create dynamic article listing and detail pages
4. **Add Authentication**: Set up user login/registration system

---

## 📝 **Notes**

- The monorepo structure is working well with npm workspaces
- Shared package successfully built and integrated
- Basic layout and navigation implemented
- Internationalization implemented with Chinese as default language
- Language switcher added to header for easy language switching
- Ready to connect frontend to backend API
- PostgreSQL authentication needs to be resolved for Strapi to start 