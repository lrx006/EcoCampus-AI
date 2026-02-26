import os
import random
import requests

REPORT_PRESETS = [
    "本周你在节能知识闯关中表现不错！坚持从小事做起，关灯、节水、垃圾分类，都是对地球的贡献。继续加油，环保值会越来越高！",
    "你的环保意识正在提升！每一点节约都会汇聚成巨大的能量。建议下周多尝试「光照调节」：白天多用自然光，既护眼又省电。",
    "感谢你参与校园节能行动！你的选择正在减少碳排放。下一周可以挑战：空调设定在 26℃、随手关灯、电池送到回收点，一起做地球的守护者。",
    "本周节能周报：你的环保值体现了你对绿色生活的重视。养成随手关灯、合理设定空调的习惯，长期下来能显著降低校园能耗。",
    "太棒了！你在闯关中的表现说明你已掌握基础节能知识。继续保持，并把知识用到日常：回收电池、节约用水用电，你就是校园里的环保小达人。",
    "校园节能离不开每一个人的参与。你的每一次正确选择，都在为绿色校园加分。下周记得：离开教室关灯、电脑不用时休眠，小小举动大大能量。",
    "环保不是一天的事，而是每一天的事。本周的闯关表现已经证明你在进步，把学到的知识带到宿舍、食堂、教室，你就是行走的节能宣传员。",
    "节能周报提醒：夏天空调每调高 1℃，约可省电 7%。把 26℃ 设为习惯，既舒适又低碳。电池、灯管记得投放到指定回收点哦。",
    "你的节能选择正在产生真实影响。据估算，校园若普遍采用自然光+分区照明，年用电可降一成以上。继续做那个关灯、关空调的人吧！",
    "你的环保意识已经走在很多人前面。把闯关里学到的「电池回收」「光照调节」「空调设定」带到生活中，你就是真正的校园节能指挥官。",
]


def _generate_report_with_deepseek(score: int):
    api_key = os.environ.get("DEEPSEEK_API_KEY", "").strip()
    if not api_key:
        return None
    try:
        url = "https://api.deepseek.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "你是一名「EcoCampus 首席节能官」，说话风格幽默、富有激情。请根据用户的得分（满分 100 分），生成一份像游戏战报一样的简短评语，多用 Emoji，最后必须给出一个具体的行动指令。不要用 markdown，纯文本即可。"},
                {"role": "user", "content": f"用户本周节能闯关得分为 {score} 分（满分 100）。请生成战报式评语并给出一个具体行动指令。"},
            ],
            "max_tokens": 256,
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        choices = data.get("choices")
        if not choices:
            return None
        message = choices[0].get("message") or {}
        text = (message.get("content") or "").strip()
        return text or None
    except Exception:
        return None


def get_report(score: int):
    score = max(0, min(100, score))
    text = _generate_report_with_deepseek(score)
    if not text:
        text = random.choice(REPORT_PRESETS)
    return text
