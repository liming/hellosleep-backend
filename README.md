# HelloSleep

A comprehensive sleep improvement platform with backend API, web frontend, and mobile app.

## 🏗️ Project Structure

```
hellosleep/
├── service/          # Strapi backend API
├── web/             # Web frontend (React/Next.js)
├── shared/          # Shared utilities and types
└── package.json     # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Yarn or npm
- PostgreSQL (for service)

### Installation
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm install
cd service && npm install
cd ../web && npm install
```

### Development
```bash
# Start all services
npm run dev

# Start individual services
npm run dev:service    # Strapi backend
npm run dev:web        # Web frontend
```

## 📁 Services

### Service (Backend)
- **Technology**: Strapi 4.25.23
- **Database**: PostgreSQL
- **Port**: 1337
- **Admin**: http://localhost:1337/admin

### Web (Frontend)
- **Technology**: React/Next.js
- **Port**: 3000
- **URL**: http://localhost:3000



## 🔧 Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:service      # Start Strapi backend
npm run dev:web          # Start web frontend


# Build
npm run build            # Build all services
npm run build:service    # Build Strapi
npm run build:web        # Build web app

# Utilities
npm run install:all      # Install all dependencies
npm run clean            # Clean all node_modules
```

## 📝 Migration Scripts

The service includes migration scripts for importing articles:

```bash
cd service
npm run single-migration-test    # Test single article migration
npm run single-import-test       # Test single article import
npm run batch-export             # Export all articles from remote
npm run batch-migration          # Migrate all articles
npm run batch-import             # Import all articles to local
npm run migrate-all              # Run full migration pipeline
```

## 🛠️ Development

### Adding New Dependencies
```bash
# Add to specific service
cd service && npm install package-name
cd ../web && npm install package-name

# Add to root (shared dependencies)
npm install package-name
```

### Code Organization
- **service/**: Backend API and database
- **web/**: Web frontend application

- **shared/**: Shared utilities, types, and constants

## 📄 License

MIT 