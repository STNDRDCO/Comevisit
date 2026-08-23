# Attention Radar

Generic social opportunity radar. Che Mira is the first project configuration, not a dependency of the engine.

## Architecture

- `lib/attention-radar/types.ts`: project/result contracts.
- `lib/attention-radar/projects.ts`: project configurations. Override with `ATTENTION_RADAR_PROJECTS_JSON`.
- `lib/attention-radar/xai.ts`: xAI adapter using Grok + server-side X Search.
- `POST /api/attention-radar/run`: execute a project scan.
- `GET /api/attention-radar/health`: health/configuration status.
- `GET /api/attention-radar/projects`: list configured projects.

## Required environment variables

- `XAI_API_KEY`: xAI API key with access to Grok/X Search.
- `ATTENTION_RADAR_SECRET`: bearer secret protecting the run endpoint in production.

Optional:

- `ATTENTION_RADAR_MODEL`: defaults to `grok-4.6`.
- `ATTENTION_RADAR_PROJECTS_JSON`: JSON array of project configs; when omitted, the built-in Che Mira configuration is used.

## Run

```bash
curl -X POST https://YOUR_HOST/api/attention-radar/run \
  -H "Authorization: Bearer $ATTENTION_RADAR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"che-mira"}'
```

The response contains ranked opportunities with source URL, author, recommended action, suggested copy, and a stable fingerprint for downstream deduplication.

## Decoupling

The engine knows only about `RadarProject`. To add a new use case, add another project config or inject `ATTENTION_RADAR_PROJECTS_JSON`; no engine code changes are required.

Future adapters can implement Reddit, Hacker News, Threads, Google Trends, or another X provider without changing project configuration or downstream consumers.
