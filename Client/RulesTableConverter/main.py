import json

from firebase_admin import db, initialize_app
from firebase_functions import https_fn

from glossary_source import CACHE_PATH, update_glossary_cache


initialize_app()


@https_fn.on_request(region="europe-west1", invoker="private", timeout_sec=180)
def sync_glossary(request: https_fn.Request) -> https_fn.Response:
    if request.method != "POST":
        return https_fn.Response("Method not allowed", status=405, headers={"Allow": "POST"})

    result = update_glossary_cache(db.reference(CACHE_PATH))
    return https_fn.Response(
        json.dumps(result),
        mimetype="application/json",
    )
