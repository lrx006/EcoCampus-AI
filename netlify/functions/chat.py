import json
from lib.chat import chat_reply

def handler(event, context):
    try:
        body = event.get("body") or "{}"
        data = json.loads(body) if isinstance(body, str) else body
        message = data.get("message", "")
        if not isinstance(message, str):
            message = ""
        reply = chat_reply(message)
        return _resp(200, {"reply": reply})
    except Exception:
        return _resp(200, {"reply": "我这边有点卡，稍后再试一下吧～"})


def _resp(code, obj):
    return {
        "statusCode": code,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(obj, ensure_ascii=False),
    }
