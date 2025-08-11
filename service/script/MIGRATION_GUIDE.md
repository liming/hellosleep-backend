# Article Migration Guide

## Overview

This guide documents the complete process of migrating articles from a remote Strapi 3 server to a local Strapi 5 instance, including the resolution of various technical challenges encountered during the migration.

## Migration Statistics

- **Total Articles**: 158
- **Successfully Migrated**: 155 (97.8%)
- **Failed**: 3 (2.2% - due to invalid internal links)
- **Categories**: 6 (already existed in Strapi)
- **Migration Date**: August 11, 2025

## Technical Challenges Resolved

### 1. Format Field Validation Errors

**Problem**: Strapi 5's Lexical JSON format requires specific `format` fields on blocks and text nodes.

**Solution**: Updated migration script to add proper format values:
- **List blocks**: `format: "ordered"` or `format: "unordered"`
- **All other blocks**: `format: 0`
- **Text nodes**: `format: 0` (normal) or `format: 1` (bold)

### 2. Category Linking with UID Keys

**Problem**: Strapi 5 uses UID keys for category relations instead of numeric IDs.

**Solution**: 
- Added `key` field to category schema (type: `uid`)
- Generated English keys from Chinese category names
- Updated migration to use key-based category relations

### 3. Image Structure in Lexical JSON

**Problem**: Images need complete metadata structure for Strapi 5.

**Solution**: Created full image objects with:
- `ext`, `url`, `hash`, `mime`, `name`, `size`, `width`, `height`
- `formats` (small, thumbnail)
- `provider`, `createdAt`, `updatedAt`, `previewUrl`, `alternativeText`

### 4. Sharing Component Migration

**Problem**: Old `contributor` field needed to be migrated to new `sharing` component.

**Solution**: 
- Updated schema to use `sharing` component (single, not repeatable)
- Migrated `contributor` and `userLink` data to new structure

### 5. Strapi 5 API Structure Changes (CRITICAL DISCOVERY)

**Problem**: Category relations were showing as `null` despite correct migration data. Individual article API endpoints (`/api/articles/{id}`) were returning 404 for PUT/DELETE operations.

**Root Cause**: Strapi 5 uses a completely different API structure compared to Strapi 4:
- **Data Location**: Data is directly in the root object, NOT nested under `attributes`
- **Relations**: Use `documentId` instead of `id` for relations
- **API Endpoints**: Individual content type endpoints may have different behavior

**Solution**: 
- Updated all scripts to use `documentId` for category relations
- Modified API calls to access data directly from root object
- Updated category mapping to use `documentId` instead of `id`

**Key Differences**:
```json
// Strapi 4 Structure
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Article Title",
      "category": 5
    }
  }
}

// Strapi 5 Structure  
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

**Important Notes**:
- Always use `documentId` for relations in Strapi 5
- Data is not nested under `attributes` in Strapi 5
- Individual content type endpoints may have restricted access
- Category relations work correctly when using `documentId`

### 6. Failed Articles Due to Invalid Internal Links

**Problem**: 3 articles failed to import due to validation errors related to invalid internal links in their content.

**Failed Articles**:
1. **"写给失眠的学生 - 学会换气，才能游向更广阔的世界"**
   - **Error**: `Please specify a valid link`
   - **Invalid Link**: `5b35dfcbd49e3a40708f7f78`
   - **Location**: `body[24].children[1].url`

2. **"走出失眠 | 更生会讲座"**
   - **Error**: `Please specify a valid link`
   - **Invalid Link**: `tutorial/5b46e991bf28873e046e1af8`
   - **Location**: `body[11].children[1].url`

3. **"怎样对待恼人的噪音？"**
   - **Error**: `Please specify a valid link`
   - **Invalid Link**: `t/category/5b35dff7d49e3a40708f7f79`
   - **Location**: `body[31].children[1].children[1].url`

**Root Cause**: These articles contain internal links that reference non-existent articles or categories from the original Strapi 3 system. The links use old IDs or malformed URLs that don't exist in the new system.

**Solution Options**:
1. **Manual Content Fix**: Edit the articles in Strapi admin to remove or fix the invalid links
2. **Migration Script Enhancement**: Add link validation and cleanup to the migration script
3. **Content Review**: Review and update the internal linking strategy for the new system

**Status**: These articles need manual intervention to fix the internal links before they can be imported.

## Migration Process

### Step 1: Export Remote Articles

```bash
node batch-export.js
```

**Output**: `remote-articles-export.json` and `remote-articles-simplified.json`

### Step 2: Migrate Articles to Strapi 5 Format

```bash
node improved-migration.js
```

**Output**: 
- `migrated-categories.json`
- `migrated-remote-articles-improved.json`

### Step 3: Import Categories

```bash
node improved-import.js categories
```

**Output**: Categories imported with UID keys

### Step 4: Import Articles

```bash
node improved-import.js
```

**Output**: Articles imported with category relations

## Scripts Overview

### Core Migration Scripts

1. **`batch-export.js`** - Exports articles from remote Strapi 3
2. **`improved-migration.js`** - Migrates articles to Strapi 5 format
3. **`improved-import.js`** - Imports articles and categories to Strapi 5

### Testing Scripts

1. **`single-migration-test.js`** - Tests migration of single article
2. **`single-import-test.js`** - Tests import of single article
3. **`test-format-fix.js`** - Tests format field fixes
4. **`test-format-import.js`** - Tests import with format fixes

## Category Mapping

| Chinese Name | English Key |
|-------------|-------------|
| 失眠者必读 | insomnia-must-read |
| 常见问题 | common-questions |
| 改善生活 | improve-life |
| 专题 | special-topics |
| 误区 | misconceptions |
| 基础知识 | basic-knowledge |

## Lexical JSON Structure

### Block Types and Format Values

```json
{
  "type": "paragraph",
  "format": 0,
  "children": [
    {
      "type": "text",
      "text": "Content",
      "format": 0
    }
  ]
}
```

### List Structure

```json
{
  "type": "list",
  "format": "unordered",
  "listType": "bullet",
  "children": [
    {
      "type": "list-item",
      "children": [
        {
          "type": "text",
          "text": "List item",
          "format": 0
        }
      ]
    }
  ]
}
```

### Image Structure

```json
{
  "type": "image",
  "format": 0,
  "image": {
    "ext": ".jpg",
    "url": "https://example.com/image.jpg",
    "hash": "external_timestamp_random",
    "mime": "image/jpg",
    "name": "image.jpg",
    "size": 40.46,
    "width": 640,
    "height": 480,
    "formats": {
      "small": { /* ... */ },
      "thumbnail": { /* ... */ }
    },
    "provider": "external",
    "createdAt": "2025-08-10T02:16:13.027Z",
    "updatedAt": "2025-08-10T02:16:13.027Z",
    "previewUrl": null,
    "alternativeText": "Image description",
    "provider_metadata": null
  },
  "children": [
    {
      "type": "text",
      "text": "",
      "format": 0
    }
  ]
}
```

## Environment Variables

Required in `service/.env`:
```
LOCAL_API_TOKEN=your-strapi-api-token
```

## Troubleshooting

### Common Issues

1. **Format Validation Errors**: Ensure all blocks and text nodes have proper format fields
2. **Category Not Found**: Check if categories are imported before articles
3. **Invalid Links**: Some articles may have broken internal links
4. **Duplicate Keys**: Categories may already exist in Strapi

### Validation Commands

```bash
# Check article count
curl -H "Authorization: Bearer $LOCAL_API_TOKEN" "http://localhost:1337/api/articles?populate=*" | jq '.meta.pagination'

# Check category count
curl -H "Authorization: Bearer $LOCAL_API_TOKEN" "http://localhost:1337/api/categories?populate=*" | jq '.meta.pagination'

# Test single article
curl -H "Authorization: Bearer $LOCAL_API_TOKEN" "http://localhost:1337/api/articles/ID?populate=*" | jq '.data.attributes'
```

## Future Improvements

1. **Link Validation**: Add validation for internal links before import
2. **Batch Processing**: Implement better error handling for batch operations
3. **Rollback**: Add ability to rollback failed imports
4. **Progress Tracking**: Add progress indicators for long-running operations

## Files Generated

- `remote-articles-export.json` - Raw export from remote server
- `remote-articles-simplified.json` - Simplified article data
- `migrated-categories.json` - Categories ready for import
- `migrated-remote-articles-improved.json` - Articles ready for import
- `import-results-improved.json` - Import results and errors
- `test-format-fixed-article.json` - Test article with format fixes 