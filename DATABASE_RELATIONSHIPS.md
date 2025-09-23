# HelloSleep Backend Database Relationships

## Overview
This document provides a comprehensive overview of the database relationships in the HelloSleep backend PostgreSQL database. The database uses Strapi 5 with a hybrid approach for multilingual content.

## Database Schema Summary

### Core Business Tables
- **articles** (310 records) - Content articles (tutorial, share, blog)
- **categories** - Article categorization
- **booklets** - Assessment recommendation booklets
- **questions** - Assessment questions
- **files** - File uploads and media
- **admin_users** - Strapi admin users
- **up_users** - User permissions plugin users

### Strapi System Tables
- **i18n_locale** - Internationalization locales
- **strapi_*** - Strapi core system tables
- **upload_folders** - File organization

## Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   admin_users   │    │   up_users      │    │  i18n_locale    │
│                 │    │                 │    │                 │
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ username        │    │ username        │    │ name            │
│ email           │    │ email           │    │ code            │
│ password        │    │ password        │    │ is_default      │
│ created_by_id   │    │ created_by_id   │    │ created_by_id   │
│ updated_by_id   │    │ updated_by_id   │    │ updated_by_id   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    articles     │    │    questions    │    │    booklets     │
│                 │    │                 │    │                 │
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ document_id     │    │ document_id     │    │ document_id     │
│ title           │    │ name            │    │ title           │
│ type            │    │ type            │    │ description     │
│ locale          │    │ locale          │    │ locale          │
│ body (jsonb)    │    │ options (jsonb) │    │ recommendations │
│ created_by_id   │    │ created_by_id   │    │ tags (jsonb)    │
│ updated_by_id   │    │ updated_by_id   │    │ created_by_id   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│    categories   │              │                       │
│                 │              │                       │
│ id (PK)         │              │                       │
│ document_id     │              │                       │
│ name            │              │                       │
│ key             │              │                       │
│ locale          │              │                       │
│ created_by_id   │              │                       │
│ updated_by_id   │              │                       │
└─────────────────┘              │                       │
         │                       │                       │
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│articles_category│              │                       │
│      _lnk       │              │                       │
│                 │              │                       │
│ article_id (FK) │──────────────┘                       │
│ category_id (FK)│──────────────────────────────────────┘
└─────────────────┘
```

## Detailed Table Relationships

### 1. Articles System

#### articles
- **Primary Key**: `id` (integer, auto-increment)
- **Unique Identifier**: `document_id` (varchar)
- **Content Types**: tutorial, share, blog
- **Locales**: en, zh
- **Rich Content**: `body` (JSONB with structured content)

**Foreign Keys:**
- `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
- `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

**Referenced By:**
- `articles_category_lnk.article_id` (ON DELETE CASCADE)
- `articles_cmps.entity_id` (ON DELETE CASCADE)

#### articles_category_lnk (Many-to-Many)
- **Purpose**: Links articles to categories
- **Foreign Keys:**
  - `article_id` → `articles.id` (ON DELETE CASCADE)
  - `category_id` → `categories.id` (ON DELETE CASCADE)

#### categories
- **Primary Key**: `id` (integer, auto-increment)
- **Unique Identifier**: `document_id` (varchar)
- **Category Key**: `key` (varchar) - unique identifier
- **Locales**: en, zh

**Foreign Keys:**
- `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
- `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

### 2. Assessment System

#### questions
- **Primary Key**: `id` (integer, auto-increment)
- **Unique Identifier**: `document_id` (varchar)
- **Question Type**: single_choice, multiple_choice, scale, text, etc.
- **Options**: `options` (JSONB) - question options stored as JSON
- **Dependencies**: `depends_on` (JSONB) - conditional logic
- **Section**: `section` (varchar) - question grouping

**Foreign Keys:**
- `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
- `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

#### booklets
- **Primary Key**: `id` (integer, auto-increment)
- **Unique Identifier**: `document_id` (varchar)
- **Assessment Data**: `assessment_answers` (JSONB)
- **User Profile**: `user_profile` (JSONB)
- **Recommendations**: `recommendations` (JSONB)
- **Tags**: `tags` (JSONB) - associated assessment tags
- **Confidence**: `confidence` (numeric) - AI confidence score
- **Usage Tracking**: `usage_count`, `last_used`

**Foreign Keys:**
- `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
- `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

### 3. File Management System

#### files
- **Primary Key**: `id` (integer, auto-increment)
- **File Metadata**: name, url, mime, size, etc.
- **External Files**: Support for external URLs

**Foreign Keys:**
- `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
- `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

**Referenced By:**
- `files_folder_lnk.file_id` (ON DELETE CASCADE)
- `files_related_mph.file_id` (ON DELETE CASCADE)

#### upload_folders
- **Primary Key**: `id` (integer, auto-increment)
- **Hierarchical Structure**: Self-referencing parent-child relationships

**Foreign Keys:**
- `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
- `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

**Referenced By:**
- `files_folder_lnk.folder_id` (ON DELETE CASCADE)
- `upload_folders_parent_lnk` (self-referencing)

### 4. User Management System

#### admin_users
- **Primary Key**: `id` (integer, auto-increment)
- **Self-Referencing**: created_by_id, updated_by_id
- **Purpose**: Strapi admin panel users

#### up_users (Users Permissions Plugin)
- **Primary Key**: `id` (integer, auto-increment)
- **Purpose**: Frontend user authentication
- **Foreign Keys:**
  - `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
  - `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

### 5. Internationalization (i18n)

#### i18n_locale
- **Primary Key**: `id` (integer, auto-increment)
- **Supported Locales**: en, zh
- **Default Locale**: is_default (boolean)

**Foreign Keys:**
- `created_by_id` → `admin_users.id` (ON DELETE SET NULL)
- `updated_by_id` → `admin_users.id` (ON DELETE SET NULL)

## Key Design Patterns

### 1. Hybrid Multilingual Approach
- **Core Data**: Language-independent fields (id, document_id, type, etc.)
- **Translatable Content**: Stored in same table with `locale` field
- **Benefits**: Single query for complete content, simpler relationships

### 2. JSONB Usage
- **articles.body**: Rich text content with images, formatting
- **questions.options**: Question options as JSON array
- **booklets.recommendations**: Assessment recommendations
- **Benefits**: Flexible schema, complex data storage, PostgreSQL native support

### 3. Audit Trail
- **Every Content Table**: created_by_id, updated_by_id, created_at, updated_at
- **Soft Deletes**: published_at field for draft/published states
- **Benefits**: Full audit trail, content versioning

### 4. Document-Based IDs
- **document_id**: Human-readable unique identifiers
- **Benefits**: SEO-friendly URLs, easier content management

## Data Statistics

### Articles Distribution
- **Total Articles**: 310
- **Share Articles**: 216 (69.7%)
- **Tutorial Articles**: 86 (27.7%)
- **Blog Articles**: 8 (2.6%)

### Locale Distribution
- **English (en)**: Available for all content types
- **Chinese (zh)**: Available for all content types

## Query Examples

### Get Article with Categories
```sql
SELECT a.title, a.type, c.name as category_name
FROM articles a
LEFT JOIN articles_category_lnk acl ON a.id = acl.article_id
LEFT JOIN categories c ON acl.category_id = c.id
WHERE a.locale = 'en' AND a.type = 'tutorial';
```

### Get Assessment Questions with Options
```sql
SELECT name, type, options, section
FROM questions
WHERE locale = 'zh' AND type = 'single_choice'
ORDER BY index;
```

### Get Booklets by Tags
```sql
SELECT title, description, tags, confidence
FROM booklets
WHERE locale = 'en' AND tags @> '["sleep_quality"]'::jsonb;
```

## Migration Considerations

### For Assessment System Implementation
1. **Questions Table**: Already supports JSONB options (perfect for your design)
2. **Booklets Table**: Rich structure with tags, recommendations, confidence scoring
3. **Categories**: Can be used for question/assessment categorization
4. **Files**: Supports external URLs (useful for assessment images)

### Recommended Schema Additions
1. **assessment_tags** - Dedicated tags table for better normalization
2. **assessment_results** - User assessment results storage
3. **assessment_sessions** - Track user assessment sessions

## Security & Performance

### Indexes
- **Primary Keys**: All tables have B-tree indexes on id
- **Foreign Keys**: Indexed for join performance
- **Composite Indexes**: articles_documents_idx (document_id, locale, published_at)

### Constraints
- **Cascade Deletes**: Link tables use CASCADE for data integrity
- **Set Null**: Audit fields use SET NULL to preserve data
- **Unique Constraints**: document_id fields for uniqueness

## Maintenance Notes

### Regular Maintenance
1. **Cleanup**: Remove unused external file references
2. **Optimization**: Monitor JSONB query performance
3. **Backup**: Regular PostgreSQL dumps
4. **Monitoring**: Track query performance on large JSONB fields

### Future Considerations
1. **Partitioning**: Consider partitioning articles by type or date
2. **Archiving**: Implement article archiving strategy
3. **Caching**: Add Redis for frequently accessed content
4. **Search**: Implement full-text search on JSONB content

---

*Last Updated: $(date)*
*Database Version: PostgreSQL with Strapi 5.21.0*
