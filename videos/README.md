# videos/ — SNS動画の制作ワークスペース

ワーホリ実務ノートの集客用ショート動画（TikTok / Instagramリール）の台本・音声・素材を置く場所。
**サイト本体には含まれない。** `.gitignore` で音声・動画・スクショは公開リポジトリに入らないようにしてある（台本 `.md` と生成スクリプト `.py` だけ追跡）。

## 1本 = 1フォルダ

```
videos/
  uber-2000/
    script.md      … ショット割・ナレーション全文・キャプション（★これが本体）
    gen_voice.py   … VOICEVOXでナレーションwavを生成
    voice/         … 生成された .wav（gitignore）
    assets/        … スクショ・B-roll を入れる（gitignore）
    out/           … 書き出した動画（gitignore）
```

## 作り方

1. `script.md` を書く（型は [reference_shortform_viral_playbook] のメモに準拠：フック→①②③④→再フック→CTA→ループ）
2. VOICEVOXアプリを起動 → `python3 videos/<name>/gen_voice.py` でナレーション生成
3. `assets/` にスクショ・自撮りB-rollを入れる（ストック素材は使わない＝実体験の証明）
4. CapCut等で組む。または MoviePy 合成スクリプトを別途用意
5. TikTok / Instagram 両方に投稿。リンクはプロフィール（bio）に。キャプションは `script.md` からコピペ

## ルール

- 顔出しなし。声はVOICEVOX No.7（アナウンス）で固定＝アカウントの記号
- クレジット「VOICEVOX:No.7」を画面内に必ず表示
- 数字・お金の話は実データのみ。盛らない（サイトの看板が「正直に数字を出す」）
- 静止画面3秒以上禁止／1.5〜2秒ごとにテロップor画面を変える／トレンド音源を薄く敷く
