These are scripts to convert rules into json data readable by the app. first I started with an excel file where I entered each keyword manually. But that process was too laborious for a software developer so I decided to write a converter for the markdown version of "The law of ato" into the json format I needed.

## Python Firebase codebase

This directory is also the `glossary` functions codebase using Python.

`sync_glossary` in [main.py](./main.py) downloads the current Law of ATO
Markdown and calls `extract_entries` from [the existing converter](./convertMarkdownToJson.py)
directly. It validates the rules and writes them to Realtime Database at
`glossaryCache`.
The cache contains `rulesJson` (a JSON string), `ruleCount`, `updatedAt`, and
`sourceUrl`. Failed downloads or invalid conversions do not replace the previous cache.

This HTTP function accepts POST requests and is configured for private invocation
in production. It returns `ruleCount` and `updatedAt` after the database write
succeeds. It does not run on a schedule yet.

### Local setup

Requires Python 3.12 with `venv` and `pip` available. From this directory:

```sh
python3.12 -m venv venv
venv/bin/python -m pip install -r requirements.txt
```

Then run `npm run emulators` from `Client`. Fetch, convert, and save the rules to
the local database emulator with:

```sh
curl -X POST http://127.0.0.1:5001/aeon-glossary-cb44f/europe-west1/sync_glossary
```

The function makes a real request to Google Docs. In the Functions emulator, it
requires `FIREBASE_DATABASE_EMULATOR_HOST` to be set (automatically configured when
the database emulator is running) and refuses to sync locally without it.
It uses the Firebase runtime's database configuration and credentials; no service
account key is stored in this repository.

After reviewing this step, only this codebase can be deployed from `Client` using
`npx firebase deploy --only functions:glossary`. In production, invoke the deployed
`sync_glossary` URL with an authenticated POST request from an authorized IAM
identity. That request updates the production cache directly.

Run the isolated fetch/conversion/cache tests without Firebase dependencies or network
access from this directory:

```sh
python3.12 -m unittest discover -p 'test_*.py'
```
