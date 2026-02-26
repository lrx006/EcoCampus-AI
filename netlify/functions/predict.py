import json
from lib.model import EnergyPredictor

predictor = EnergyPredictor()

def handler(event, context):
    try:
        body = event.get("body") or "{}"
        data = json.loads(body) if isinstance(body, str) else body
        hour = float(data.get("hour", 12))
        temp = float(data.get("temp", 20))
        is_holiday = int(data.get("is_holiday", 0))
        if not 0 <= hour <= 24:
            return _resp(400, {"error": "hour 需在 0-24 之间"})
        if not 0 <= is_holiday <= 1:
            return _resp(400, {"error": "is_holiday 需为 0 或 1"})
        power = predictor.predict(hour, temp, is_holiday)
        return _resp(200, {"power": round(power, 2)})
    except (TypeError, ValueError) as e:
        return _resp(400, {"error": f"参数错误: {e}"})


def _resp(code, obj):
    return {
        "statusCode": code,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(obj, ensure_ascii=False),
    }
