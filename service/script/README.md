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

- Strapi running on `http://localhost:1337` (or set `STRAPI_URL` for production)
- `LOCAL_API_TOKEN` or `STRAPI_API_TOKEN` set in `service/.env` (or env when running)
- Remote Strapi 3 server accessible (for export)

## Import to production (e.g. Railway)

To import articles to your production Strapi (e.g. Railway):

1. Ensure you have the migrated files in `service/script/`:
   - `migrated-categories.json`
   - `migrated-remote-articles-improved.json`
   (If not, run export + transform first against your old Strapi 3.)

2. Create an API token in production Strapi:
   - Open `https://your-app.up.railway.app/admin` → Settings → API Tokens → Create new API Token (Full access or custom with content read/write).

3. From repo root, run (replace with your URL and token):

   ```bash
   cd service
   STRAPI_URL=https://hellosleep-production.up.railway.app STRAPI_API_TOKEN=your-token node script/improved-import.js categories
   STRAPI_URL=https://hellosleep-production.up.railway.app STRAPI_API_TOKEN=your-token node script/improved-import.js
   ```

   Or add `STRAPI_URL` and `STRAPI_API_TOKEN` to `service/.env` and run:

   ```bash
   cd service && npm run migration:import-categories
   cd service && npm run migration:import
   ```

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