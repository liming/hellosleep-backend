# Evaluation Migration Results

## Overview

Migrates `evaluations` from the old Strapi 3 GraphQL API (`http://hellosleep.net:1337/graphql`)
to the new Strapi 5 REST `assessment-results` collection.

---

## Field Mapping

| Old field (`evaluations`) | New field (`assessment-results`) | Notes |
|---|---|---|
| `id` | — | Used only for deduplication tracking |
| `email` | `user` (relation) | Looked up by email in new Strapi users; relation set if found |
| `answers` | `answers` | JSON — parsed from string if stored as string in Strapi 3 |
| `tags` | `tags` | JSON array — parsed from string if needed |
| `createdAt` | `completedAt` | ISO datetime |

Evaluations whose email does not match any user in the new Strapi are still
migrated — the `user` relation is simply left unset.

---

## Script

**File:** `service/script/migrate-evaluations.js`

### Prerequisites

- Node.js 18+ (uses native `fetch`)
- `dotenv` package (`npm install` in `service/`)
- New Strapi running and accessible
- API token with write access to `assessment-results` and read access to `users`

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OLD_GRAPHQL_URL` | `http://hellosleep.net:1337/graphql` | Old Strapi 3 GraphQL endpoint |
| `NEW_STRAPI_URL` | `http://localhost:1337` | New Strapi 5 base URL |
| `NEW_STRAPI_TOKEN` | *(from `LOCAL_API_TOKEN` in `.env`)* | New Strapi API token |
| `BATCH_SIZE` | `100` | Records per GraphQL page |
| `DRY_RUN` | `false` | Fetch & map only, do not write |

### Usage

```bash
# Dry run (no writes, useful to verify connectivity and mapping)
DRY_RUN=true node script/migrate-evaluations.js

# Local Strapi
node script/migrate-evaluations.js

# Production Strapi
NEW_STRAPI_URL=https://your-strapi.railway.app \
NEW_STRAPI_TOKEN=your_token \
node script/migrate-evaluations.js
```

### Resume / Deduplication

The script writes a progress file `service/script/migrate-evaluations-progress.json`
containing:

- `migratedIds` — list of old evaluation IDs already successfully migrated
- `cachedEvaluations` — the full export from the old API (avoids re-fetching)

Re-running the script automatically skips already-migrated records. To start
fresh, delete `migrate-evaluations-progress.json`.

### Output Files

| File | Contents |
|---|---|
| `migrate-evaluations-progress.json` | Resume checkpoint (auto-managed) |
| `migrate-evaluations-results.json` | Final summary: counts, errors |

---

## Migration Run Log

*(Update this section after each run)*

### Run 1 — PENDING

| Metric | Value |
|---|---|
| Date | — |
| Total evaluations | 2617 (expected) |
| Migrated | — |
| Skipped (duplicate) | — |
| No user match | — |
| Failed | — |
| Duration | — |

#### Notes

- Not yet executed.
- Run `DRY_RUN=true` first to verify connectivity.

---

## Known Issues / Considerations

1. **User matching**: Only exact email match is used. Evaluations with no matching
   user are imported without a `user` relation. These can be re-linked manually
   later via the Strapi admin panel.

2. **Rate limiting**: A 100 ms delay is added between write requests. Increase
   `WRITE_DELAY_MS` in the script if the new Strapi returns 429 errors.

3. **answers / tags format**: Strapi 3 may store JSON fields as serialised
   strings. The script parses them automatically.

4. **Idempotency**: Deduplication is based on old evaluation `id` stored in
   the progress file — not on any field in the new Strapi. If the progress
   file is deleted, re-running will create duplicates.
