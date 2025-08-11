# Strapi 5 Relations: Critical Technical Discovery

## Problem Summary

During article migration from Strapi 3 to Strapi 5, we encountered a critical issue where:
1. Category relations were showing as `null` in imported articles
2. Individual article API endpoints (`/api/articles/{id}`) returned 404 for PUT/DELETE operations
3. Despite correct migration data, relations were not being established

## Root Cause: Strapi 5 API Structure Changes

Strapi 5 introduced fundamental changes to its API structure that are not well documented:

### 1. Data Location Change
**Strapi 4**: Data nested under `attributes`
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Article Title",
      "category": 5
    }
  }
}
```

**Strapi 5**: Data directly in root object
```json
{
  "data": [
    {
      "id": 797,
      "documentId": "fkesuh3kcvnop46eeukr215m",
      "title": "Article Title",
      "category": {
        "id": 28,
        "documentId": "d8s802golyt2u852p5uc3rm5",
        "name": "Category Name"
      }
    }
  ]
}
```

### 2. Relation Identifier Change
**Strapi 4**: Use numeric `id` for relations
**Strapi 5**: Use `documentId` (string) for relations

### 3. API Endpoint Behavior
Individual content type endpoints may have restricted access or different behavior in Strapi 5.

## Solution Implemented

### Updated Scripts
1. **`single-import-test.js`**: Updated to use `documentId` for category mapping
2. **`improved-import.js`**: Updated to use `documentId` for category relations

### Key Changes
```javascript
// OLD (Strapi 4 approach)
const categoryKeyToIdMapping = new Map();
categoryKeyToIdMapping.set(key, id);
articleData.category = categoryId;

// NEW (Strapi 5 approach)
const categoryKeyToDocumentIdMapping = new Map();
categoryKeyToDocumentIdMapping.set(key, documentId);
articleData.category = categoryDocumentId;
```

### API Response Structure
When querying articles with populated relations:
```json
{
  "data": [
    {
      "id": 797,
      "documentId": "fkesuh3kcvnop46eeukr215m",
      "title": "失眠是个平常事-test",
      "type": "tutorial",
      "category": {
        "id": 28,
        "documentId": "d8s802golyt2u852p5uc3rm5",
        "name": "失眠者必读",
        "key": "insomnia-must-read"
      }
    }
  ]
}
```

## Verification Commands

### Check Article with Category
```bash
curl -H "Authorization: Bearer $LOCAL_API_TOKEN" \
  "http://localhost:1337/api/articles?populate=category" | \
  jq '.data[] | select(.id == 799) | .category'
```

### Check Categories
```bash
curl -H "Authorization: Bearer $LOCAL_API_TOKEN" \
  "http://localhost:1337/api/categories" | \
  jq '.data[0] | {id, documentId, name, key}'
```

## Important Notes for Future Development

1. **Always use `documentId` for relations** in Strapi 5
2. **Data is not nested under `attributes`** in Strapi 5 responses
3. **Individual content type endpoints** may have restricted access
4. **Category relations work correctly** when using `documentId`
5. **Frontend code** may need updates to handle the new structure

## Migration Date
August 11, 2025

## Status
✅ **RESOLVED** - Category linking now works correctly with `documentId` approach 