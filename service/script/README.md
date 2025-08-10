# Migration Scripts Quick Reference

## Available Scripts

### Core Migration Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `batch-export.js` | Export articles from remote Strapi 3 | `npm run migration:export` |
| `improved-migration.js` | Transform articles to Strapi 5 format | `npm run migration:transform` |
| `improved-import.js` | Import articles to Strapi 5 | `npm run migration:import` |
| `improved-import.js categories` | Import only categories | `npm run migration:import-categories` |

### Testing Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `single-migration-test.js` | Test migration of single article | `npm run migration:test-single` |
| `single-import-test.js` | Test import of single article | `npm run migration:test-import` |

### Convenience Commands

| Command | Purpose |
|---------|---------|
| `npm run migration:full` | Run complete migration (export + transform + import) |

## Quick Start

1. **Export articles from remote server:**
   ```bash
   npm run migration:export
   ```

2. **Transform articles to Strapi 5 format:**
   ```bash
   npm run migration:transform
   ```

3. **Import categories first:**
   ```bash
   npm run migration:import-categories
   ```

4. **Import articles:**
   ```bash
   npm run migration:import
   ```

## Prerequisites

- Strapi running on `http://localhost:1337`
- `LOCAL_API_TOKEN` set in `service/.env`
- Remote Strapi 3 server accessible

## Output Files

- `remote-articles-export.json` - Raw export from remote
- `remote-articles-simplified.json` - Simplified article data
- `migrated-categories.json` - Categories ready for import
- `migrated-remote-articles-improved.json` - Articles ready for import
- `import-results-improved.json` - Import results and errors

## Troubleshooting

- **Format errors**: Run `npm run migration:test-single` to test format fixes
- **Import errors**: Check `import-results-improved.json` for details
- **Category issues**: Ensure categories are imported before articles

See `MIGRATION_GUIDE.md` for detailed documentation. 