# HelloSleep Shared

Shared utilities, types, and constants for the HelloSleep platform.

## 📁 Structure

```
shared/
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── constants/       # Shared constants
├── api/             # API client and types
└── index.ts         # Main export file
```

## 🔧 Usage

```typescript
// Import shared types
import { Article, User } from 'hellosleep-shared/types';

// Import utilities
import { formatDate, truncateText } from 'hellosleep-shared/utils';

// Import constants
import { API_ENDPOINTS } from 'hellosleep-shared/constants';
```

## 📦 Shared Types

- `Article` - Article data structure
- `User` - User data structure
- `ApiResponse` - Generic API response type
- `Pagination` - Pagination metadata

## 🛠️ Utilities

- `formatDate()` - Date formatting utilities
- `truncateText()` - Text truncation
- `validateEmail()` - Email validation
- `apiClient` - Shared API client

## 🔄 Development

```bash
# Build shared utilities
npm run build

# Watch for changes
npm run dev
``` 