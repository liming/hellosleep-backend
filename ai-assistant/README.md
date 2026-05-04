# HelloSleep AI Assistant

Sleep guidance assistant service for HelloSleep.

## Responsibilities
- user Q&A (`POST /ask`)
- unified memory retrieval from HelloSleep / Shuiba knowledge
- risk routing
- LLM-backed answer generation
- playground UI for internal testing
- ask logging (JSONL) for feedback loop

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
- `MEMORY_CHUNKS_PATH` (unified memory chunks.jsonl)
- `ARTICLES_JSON_PATH` (optional article index json)
- `ASK_LOG_PATH` (ask log jsonl path)

## Eval Harness (batch testing)
Put daily forum questions into `eval/questions.jsonl`, then run:

```bash
node eval/run-eval.js
```

## Notes
This service is intended to remain an independent runtime even when consumed through `service` / Strapi.
