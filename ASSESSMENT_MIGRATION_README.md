# Assessment migration to database

Assessment data (sections, questions, tags) is stored in Strapi and loaded by the web app via API, with static fallback when the API is unavailable.

## Strapi content types

- **Section** (`api::section.section`): `key` (uid), `name`, `description`, `order`, `questions` (relation to questions).
- **Question** (`api::question.question`): `questionId` (uid), `text`, `type`, `category` (relation to section), `required`, `options` (json), `depends` (json), `order`, `min`, `max`, `step`, `unit`, etc.
- **AssessmentTag** (`api::assessment-tag.assessment-tag`): `name` (uid), `text`, `description`, `category`, `priority`, `severity`, `calc` (json), `recommendation` (json).

Schema files are under `service/src/api/*/content-types/`.

## Seed (one-time or re-seed)

1. Start Strapi: `cd service && npm run develop`
2. Start web: `npm run dev` (or `cd web && npm run dev`)
3. Run seed: `cd service && npm run seed:assessment`

The seed script fetches data from `GET http://localhost:3000/api/assessment-seed-data` (static data) and POSTs sections, questions, and tags to Strapi. Ensure `service/.env` has `LOCAL_API_TOKEN` (or `STRAPI_API_TOKEN`).

## Web integration

- **GET /api/assessment/data** – Returns `{ sections, questions, tags }` from Strapi, shaped for the frontend. Uses env `STRAPI_URL` / `LOCAL_API_TOKEN` (or `STRAPI_API_TOKEN`). On failure returns 500 with empty arrays; the app falls back to static data.
- **GET /api/assessment-seed-data** – Returns static assessment data (for the seed script).
- **GET /api/assessment-verify** – Runs tag→booklet verification (static tags).
- **GET /api/assessment/test** – Runs full tests: load assessment data, verify all tags have booklets, run all test scenarios and check calculated tags have booklets.

The assessment page (`web/src/app/[locale]/assessment/page.tsx`) calls `fetchAssessmentData()` on load (which hits `/api/assessment/data`), then uses the returned sections, questions, and tags. Submission uses `staticAssessmentEngine.processAssessment(answers, assessmentTags)` so tags from the API are used when available.

## Testing

1. With web dev server running, open: `http://localhost:3000/api/assessment/test`  
   - Expect `ok: true` and all `results[].ok` true.
2. Run tag–booklet verification: `http://localhost:3000/api/assessment-verify`  
   - Expect `allTagsHaveBooklet: true` and `allScenariosOk: true`.
3. Manual: complete the assessment at `/zh/assessment` or `/en/assessment` and confirm results and recommendations load.

## Env (web)

For the Next.js app to call Strapi (e.g. when fetching assessment data server-side):

- `STRAPI_URL` or `NEXT_PUBLIC_STRAPI_URL` – default `http://localhost:1337`
- `LOCAL_API_TOKEN` or `STRAPI_API_TOKEN` or `NEXT_PUBLIC_STRAPI_API_TOKEN` – Strapi API token

If these are not set, `/api/assessment/data` may fail and the app will use static assessment data.
