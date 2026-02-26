import json
from lib.report import get_report

def handler(event, context):
    try:
        body = event.get("body") or "{}"
        data = json.loads(body) if isinstance(body, str) else body
        score = int(data.get("score", 0))
        report = get_report(score)
        return _resp(200, {"report": report, "score": max(0, min(100, score))})
    except (TypeError, ValueError):
        return _resp(200, {"report": get_report(0), "score": 0})


def _resp(code, obj):
    return {
        "statusCode": code,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(obj, ensure_ascii=False),
    }
