# HelloSleep AI Assistant

Sleep guidance assistant service for HelloSleep.

## Responsibilities
- user Q&A (`POST /ask`)
- unified memory retrieval from HelloSleep / Shuiba knowledge
- risk routing
- LLM-backed answer generation
- playground UI for internal testing

## Development
```bash
cd ai-assistant
npm install
npm start
```

Default port:
- `8787`

Playground:
- `http://localhost:8787/`

## Environment Variables
See `.env.example`.

Typical variables:
- `DATABASE_URL`
- `PORT`
- `LLM_PROVIDER`
- `LLM_API_KEY`
- `LLM_BASE_URL`
- `LLM_MODEL`

## Notes
This service is intended to remain an independent runtime even when consumed through `service` / Strapi.
