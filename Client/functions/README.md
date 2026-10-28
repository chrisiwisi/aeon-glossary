# Technology cache

`syncTechnologyCardsDaily` fetches `https://atcc-api.onrender.com/api/cards/all`
every day at 03:00 Europe/Vienna time. It keeps only `Technology` cards and
writes them to Realtime Database at `technologyCache`. The page reads that
cache.

## Local development

From `Client`:

Use Node.js 22.12 or newer within the configured Node.js 22 runtime and run
`npm --prefix functions install` after pulling dependency changes. The functions
pin `jose` for `jwks-rsa` to its CommonJS-compatible v5 release because the
standalone Firebase CLI can load functions without support for requiring ESM.

1. Run `npm run emulators` (Database, Functions, Pub/Sub, and UI).
2. In a second terminal run `FIREBASE_DATABASE_EMULATOR_HOST=127.0.0.1:9000 npm run sync:technology:emulator` to fill an empty local cache.

## Production

Deploy the database rules and function with `npx firebase deploy --only database,functions`
from `Client`.
The scheduled job is created on deployment. Run that job once to populate a
new production cache before its first 03:00 execution.

# Glossary cache

The glossary page loads rules and live updates from Realtime Database at
`glossaryCache/rulesJson`.
Missing or invalid cache data and read failures use bundled rules only if no
cached rules have loaded yet. Later failures keep the last valid rules and show
a warning.

The separate Python `glossary` codebase fetches the current Law of ATO,
converts it, and saves the rules directly to `glossaryCache` every day at
03:00 Europe/Vienna, matching the technology sync. The private manual POST
endpoint is also available. See the
[Python setup and sync instructions](../RulesTableConverter/README.md).
Set up the Python virtual environment before starting the Functions emulator
for both codebases.
