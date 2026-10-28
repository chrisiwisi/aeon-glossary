These are scripts to convert rules into json data readable by the app. first I started with an excel file where I entered each keyword manually. But that process was too laborious for a software developer so I decided to write a converter for the markdown version of "The law of ato" into the json format I needed.

## Python Firebase codebase

This directory is also the `glossary` functions codebase using Python.

`preview_glossary` in [main.py](./main.py) downloads the current Law of ATO
Markdown and calls `extract_entries` from [the existing converter](./convertMarkdownToJson.py)
directly. It returns the rules as JSON and is configured for private invocation
in production. It does not write to Realtime Database or run on a schedule yet.

### Local setup

Requires Python 3.12 with `venv` and `pip` available. From this directory:

```sh
python3.12 -m venv venv
venv/bin/python -m pip install -r requirements.txt
```

Then run `npm run emulators` from `Client`. Preview the converted rules with:

```sh
curl http://127.0.0.1:5001/aeon-glossary-cb44f/europe-west1/preview_glossary
```

The emulator preview makes a real request to Google Docs, but does not change
the local or production database. After reviewing this step, only this codebase
can be deployed from `Client` using `npx firebase deploy --only functions:glossary`.

Run the isolated fetch/conversion tests without Firebase dependencies or network
access from this directory:

```sh
python3.12 -m unittest discover -p 'test_*.py'
```
