# Migration Scripts

This directory contains scripts for migrating articles from remote sources to local Strapi 5.

## Scripts

### Single Test Scripts
- `single-migration-test.js` - Test migration of a single article
- `single-import-test.js` - Test import of the single migrated article

### Batch Operation Scripts  
- `batch-export.js` - Export articles from remote source
- `batch-migration.js` - Migrate all exported articles to Strapi 5 format
- `batch-import.js` - Import all migrated articles to local Strapi

## Usage

### Single Test Workflow
```bash
# 1. Test migration of single article
node script/single-migration-test.js

# 2. Test import of single migrated article  
node script/single-import-test.js
```

### Batch Workflow
```bash
# 1. Export articles from remote source
node script/batch-export.js

# 2. Migrate articles to Strapi 5 format
node script/batch-migration.js

# 3. Import migrated articles to local Strapi
node script/batch-import.js
```

## Output Files

### Single Test
- `single-migrated-article.json` - Single migrated article for testing

### Batch Operations
- `remote-articles-export.json` - Raw exported articles
- `remote-articles-simplified.json` - Simplified article data
- `migrated-remote-articles.json` - Articles in Strapi 5 format
- `import-results.json` - Import results and statistics

## Notes

- Single test scripts are for testing the migration and import process
- Batch scripts are for processing all articles
- Make sure Strapi is running on `http://localhost:1337` before importing
- Set `LOCAL_API_TOKEN` in `.env` file for authentication (optional) 