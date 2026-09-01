#!/usr/bin/env python3
"""VOICEVOX でナレーションを生成する。
使い方: VOICEVOXアプリを起動（エンジンが localhost:50021 で立つ）→ python3 gen_voice.py
声を変えるときは SID を変更（/speakers で一覧確認）。No.7 アナウンス = 30。
"""
import urllib.request, urllib.parse, json, os, wave, contextlib

OUT = os.path.join(os.path.dirname(__file__), "voice")
os.makedirs(OUT, exist_ok=True)
BASE = "http://localhost:50021"
SID = 30          # No.7（アナウンス）
SPEED = 1.15
PAUSE = 0.35

LINES = {
    "L1_hook":  "先週の稼ぎ、二千豪ドル。日本円で、約十九万円。内訳を、全部見せます。",
    "L2_split": "本業で、千二百ドル。ウーバーイーツで、八百ドル弱。合計、週二千です。",
    "L3_uber":  "ウーバーの一週間が、これ。二十六時間で、八百二十七ドル。でも、三分の一はプロモーション。基本料金は、四百九十五ドルだけです。",
    "L4_days":  "平日の昼は、稼げない。伸びるのは、土日の夜と、祝日。祝日は、プロモがバグります。",
    "L5_note":  "しかもこれ、経費と税金の前。配達員は個人事業主、確定申告も自分です。",
    "L6_real":  "二千は、本業ありき。ウーバーだけなら、週八百が、リアルです。",
    "L7_cta":   "始め方と税金、二千二十六年の新ルールは、プロフのリンクから。保存推奨です。",
}


def post(path, params, body=None):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    data = json.dumps(body).encode() if body is not None else b""
    headers = {"Content-Type": "application/json"} if body is not None else {}
    return urllib.request.urlopen(
        urllib.request.Request(url, data=data, method="POST", headers=headers), timeout=60
    ).read()


def main():
    total = 0.0
    for name, text in LINES.items():
        q = json.loads(post("/audio_query", {"text": text, "speaker": SID}))
        q["speedScale"] = SPEED
        q["pauseLength"] = PAUSE
        wav = post("/synthesis", {"speaker": SID}, q)
        p = os.path.join(OUT, name + ".wav")
        open(p, "wb").write(wav)
        with contextlib.closing(wave.open(p)) as w:
            d = w.getnframes() / w.getframerate()
        total += d
        print(f"{name:10s} {d:5.1f}s")
    print(f"{'TOTAL':10s} {total:5.1f}s")


if __name__ == "__main__":
    main()
