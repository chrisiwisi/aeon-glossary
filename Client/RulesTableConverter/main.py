import json

from firebase_functions import https_fn

from glossary_source import SOURCE_URL, fetch_law_of_ato_rules


@https_fn.on_request(region="europe-west1", invoker="private", timeout_sec=180)
def preview_glossary(request: https_fn.Request) -> https_fn.Response:
    if request.method != "GET":
        return https_fn.Response("Method not allowed", status=405, headers={"Allow": "GET"})

    rules = fetch_law_of_ato_rules()
    return https_fn.Response(
        json.dumps({"rules": rules, "ruleCount": len(rules), "sourceUrl": SOURCE_URL}, ensure_ascii=False),
        mimetype="application/json",
    )
