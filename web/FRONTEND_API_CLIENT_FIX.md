# Frontend API Client Fix - Category Filtering

## Problem Summary

The tutorial page category filtering was not working. When clicking on different categories, the page would show empty results or fail to load articles.

**Error Observed**: 
```
http://localhost:1337/api/articles?filters%5Btype%5D%5B%24eq%5D=tutorial&filters%5Bcategory%5D%5Bkey%5D=%5Bobject+Object%5D&populate=category&sort=date%3Adesc
```

The URL showed `[object Object]` instead of the actual category key value.

## Root Cause

The issue was in the `fetchArticles` function in `web/src/lib/api.ts`. The function was not properly handling double-nested filter parameters.

**Problem Code**:
```typescript
// This was only handling single-nested filters like { $eq: 'tutorial' }
Object.keys(value).forEach(operator => {
  searchParams.append(`filters[${key}][${operator}]`, value[operator]);
});
```

**Issue**: When filtering by category key, the filter structure is:
```typescript
{
  category: {
    key: {
      $eq: 'insomnia-must-read'
    }
  }
}
```

This is a double-nested structure that the original code couldn't handle.

## Solution

Updated the `fetchArticles` function to properly handle double-nested filters:

```typescript
Object.keys(value).forEach(operator => {
  const operatorValue = value[operator];
  if (typeof operatorValue === 'object' && operatorValue !== null) {
    // Handle double-nested filters like { key: { $eq: 'value' } }
    Object.keys(operatorValue).forEach(subOperator => {
      searchParams.append(`filters[${key}][${operator}][${subOperator}]`, operatorValue[subOperator]);
    });
  } else {
    // Handle single-nested filters like { $eq: 'tutorial' }
    searchParams.append(`filters[${key}][${operator}]`, operatorValue);
  }
});
```

## Files Modified

- `web/src/lib/api.ts` - Fixed `fetchArticles` function to handle double-nested filters
- `web/.env.local` - Added API configuration for frontend

## Environment Variables Required

The frontend needs these environment variables to connect to Strapi:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your-api-token-here
```

## Testing

After the fix, category filtering works correctly:

- **"失眠者必读" (insomnia-must-read)**: 6 articles
- **"常见问题" (common-questions)**: 13 articles
- **All categories**: Proper filtering and navigation

## API Endpoints Working

- `GET /api/articles?filters[type][$eq]=tutorial&populate=category` - All tutorials
- `GET /api/articles?filters[type][$eq]=tutorial&filters[category][key][$eq]=insomnia-must-read&populate=category` - Category-specific tutorials

## Status

✅ **RESOLVED** - Category filtering now works correctly on the tutorial page

## Date

August 11, 2025 