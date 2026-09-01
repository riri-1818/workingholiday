# 公開前チェックリスト(適当な情報を入れないための作業リスト)

「本当に困っている人を助けたい」という方針のもと、公開前に本人が確認・記入すべき箇所をまとめています。優先度順に3段階です。

---

## SEO大改修(2026-09-01)

チャッピー(ChatGPT)の診断を受けて技術SEOを一括で入れた。反映内容:

- 全24ページに `canonical` タグを追加(リポジトリ名変更に伴う重複URL対策)
- 全24ページに構造化データ(JSON-LD)を追加: 記事は `Article`+著者`Person`(rei)+`BreadcrumbList`、カテゴリは `CollectionPage`+`BreadcrumbList`、トップは `WebSite`+`Organization`、aboutは `AboutPage`+`Person`
- 全記事・全カテゴリに視覚的パンくずリストを追加
- 全17記事の末尾に「あわせて読みたい」内部リンク(トピッククラスター設計)を追加
- 記事の日付を `<time datetime>` で機械可読に
- `sitemap.xml`: 抜けていた `wise-money-transfer-guide` を追加、`uber-eats-2026-rules` を追加、全URLに `lastmod`
- 演出削減: 横スクロールティッカー(index)と3Dチルト(JS/CSS)を撤去
- Uber記事を3分割:
  - `uber-eats-guide.html` — 「始め方」に特化してリタイトル(収入セクションは分離)
  - `uber-eats-2026-rules.html` — **新規・公開可**。2026-08-17施行の最低報酬基準($31.30/h等)を公式情報ベースで作成
  - `uber-eats-income.html` — **新規・noindex(公開準備中)**。reiの実収入データ待ち(下記C参照)

### この改修後にreiがやること(手作業)

- [ ] **Google Search Console に登録**(本人のGoogleアカウントが必要)。sitemap URL `https://riri-1818.github.io/workingholiday/sitemap.xml` を送信 → Indexed pages / Impressions / Queries / Average position を確認
- [ ] Bing Webmaster Tools にも同様に登録(任意)
- [ ] `uber-eats-income.html` に実収入データ(売上スクショ・稼働時間・時間帯/曜日/エリア別・e-bikeレンタル代等の経費・実質時給・雨の日)を記入 → `<meta name="robots" content="noindex">` 行を削除 → sitemap.xml に追加 → index.html と category/income.html にカードを追加
- [ ] `uber-eats-2026-rules.html` の「配達員としてどう受け止めているか」に施行前後の体感を追記
- [ ] (中期)独自ドメイン検討。`riri-1818.github.io/workingholiday/` はサブディレクトリなのでサイト名・被リンクの蓄積で不利。手応えが出てから

### まだ書けていないが伸ばすなら重要(reiの実体験が必要)

- [ ] 「オーストラリアワーホリ到着後1週間にやること」ハブ記事(SIM→銀行→TFN→myGov→家→仕事→RSA→給与を時系列で並べ、既存記事へ送る入口ページ)
- [ ] 仕事探しクラスター(レジュメの書き方 / Seek・Indeed・JAMS比較 / unpaid trialは合法か / payslipの見方 / casual loadingとは / RSA・Food Handlerの取り方 など、実際の応募・面接・トライアル経験ベースで)
- [ ] 家探しクラスター(bondとは / inspectionで見るところ / エリア選び / Opal・交通)

---

## A. 【最優先】プレースホルダー・アフィリエイトボックス

### ✅ 執筆者プロフィール(全12記事 + about.html) — 完了(2026-08-31)
- [x] rei。交換留学に全落ちしてワーホリに切り替えた経緯を全ファイルに反映済み

### ✅ 実リンク導入済み(計8記事) — 2026-08-31時点
- [x] `wise-money-transfer-guide.html` — Wise実リンク+実体験(日本のクレカ払い)+紹介ボーナス(2,200円相当)の案内
- [x] `online-english-conversation.html` — ネイティブキャンプ(バナー)+スタスタLIVE英検(バナー)+DUOセレクト単語帳(実際に愛用)
- [x] `uber-eats-guide.html` — Uber Eats配達パートナー招待リンク(60日100回配達でA$500ボーナス)
- [x] `esim-working-holiday-12months.html` — felix mobile(実際に使用中のSIM)の紹介リンク
- [x] `packing-list-working-holiday.html` — マルチ変換プラグ(楽天1位、実リンク)
- [x] `rice-cooker-guide.html` — **正直な内容に大幅改訂**: 「炊飯器はKmartかフライパンで十分」という本人の実体験ベースの結論に変更。電気で炊きたい人向けに電子レンジ専用炊飯器具(実リンク)を提示
- [x] `laundry-net-guide.html` — 布団用大型洗濯ネット(実リンク、シェアハウスの共用寝具対策)。小物用はKmartで十分と正直に明記
- [x] `daily-life-extras-guide.html` — 保温保冷ボトル+フリーズドライ味噌汁(共に実際に愛用、実リンク)。カレールーの活用法(パスタにかけるカレーパスタ)も追記

### ⚠️ 保険は意図的に未リンク(本人の実体験に基づく判断)
- [x] `travel-insurance-working-holiday.html` — 本人が実際に使った「たびほ」は立て替え払い(自費→後日返金)で後悔しているとの実体験を反映。**あえて特定の保険会社は紹介せず**、「キャッシュレス診療対応」という選び方の視点(損保ジャパン・東京海上日動等の大手損保系に多い)を共有する内容に変更。提携が決まれば実リンクを追加予定

### ✅ 追加の実体験反映(2026-08-31 続報)
- [x] `uber-eats-gear-guide.html` — モバイルバッテリー(40000mAh、実リンク+実画像)。「持ってなかったら詰んでいた」という実体験を反映。スマホホルダー・ライトは「レンタル屋(Sydney Electric Bikeを実際に利用)で借りられる」ため商品紹介を削除し、正直な情報に置き換え。手袋のみ実リンク未定で残存
- [x] 商品画像の修正: 楽天から提供される実際の商品サムネイル画像を6記事(炊飯器・英会話・生活消耗品2点・洗濯ネット・持ち物リスト)に反映。それまで自サイトの汎用ストック写真のままだった箇所を本物の商品写真に差し替え

### ✅ 追加の実体験反映(2026-08-31 続報2)
- [x] `uber-eats-gear-guide.html` — 防水防寒グローブ(2本指出しタイプ、実リンク+実画像)を反映。3点全て実リンク化完了
- [x] `bank-account-opening.html` — **実際にANZで開設**した実体験を反映。ANZは到着から6週間以内に支店訪問が必要(公式情報で確認)、必要書類(パスポート・豪州住所・豪州携帯番号)も明記

### 未提携・残タスク
- [ ] `bank-account-opening.html` — 銀行口座開設の紹介プログラム(あれば。優先度低めでOK)
- [ ] 上記以外に本人から追加の実体験・リンクがあれば都度反映

---

## B. 【要検証】事実関係の裏取り — ✅ 完了(2026-08-31)

公式情報源で確認し、記事を修正・具体化しました。

- [x] `mygov-tfn-registration.html` — TFN発行は最大28日(ATO/公開情報で確認)。雇用開始から28日以内に提出しないと45%源泉徴収、という具体的な期限も追記
- [x] `travel-insurance-working-holiday.html` — RHCA対象は11ヶ国(英・愛・NZ・伊・白・スロベニア・マルタ・諾・瑞・芬・蘭)、Services Australia公式で確認。日本は対象外を再確認
- [x] `uber-eats-guide.html` / `packing-list-working-holiday.html` — NSW州の罰金額を具体化: ヘルメット未着用$344、走行中スマホ操作$349(スクールゾーン内$464)
- [x] `esim-working-holiday-12months.html` — felix mobileの実際のプラン・料金(無制限$40/月、25GB/50GB容量制プランあり)を追記
- [x] `bank-account-opening.html` — 「渡航予定日の14日前から」という具体的な申込み開始タイミングの制限を追記(2〜3ヶ月前などの早すぎる申込みはできない、という重要な訂正)

---

## C. 【推奨】実体験を足すとさらに強くなる箇所(唯一の残りタスク)

- [x] `uber-eats-guide.html` — 収入の実績値(2026-08-31追記: 副業で週800ドル弱)
- [ ] `bank-account-opening.html` — 実際にどの銀行で、何日かかったか
- [ ] `mygov-tfn-registration.html` — 実際の申請から発行までの日数(制度上の上限28日は判明済み、実際の体感日数があれば)

---

## D. 【完了】サイト全体の追加対応(2026-08-31)

- [x] 選定基準の明記: about.htmlに「PRとして紹介しているのは、自分が実際に使った経験があるもの、または身の回りで実際に使っている人から見聞きしたものだけ」という編集方針を追加
- [x] 文章の強調強化: 全12記事に`<mark>`(青ハイライト)・`<span class="warn">`(オレンジ警告ハイライト)を追加
- [x] 楽天・A8net・Felix mobile・Wiseの実体験を8記事に反映。**「Kmartで十分」「たびほは後悔している」といった、収益より正直さを優先した内容**も含む
- [x] 事実関係の裏取り(Bセクション)完了。TFN28日ルール、RHCA11ヶ国、NSW罰金額($344/$349)、felix mobile料金、銀行の14日前ルール、いずれも公式情報で確認・具体化
- [x] Google Analytics(GA4)導入(2026-08-31): 計測ID `G-0YM2E9G892` のgtag.jsを全19ページ(index/about/記事12本/カテゴリ5本)の`<head>`に設置。本番反映済み。
- [x] 新記事追加(2026-08-31): 「交換留学に落ちた人へ。ワーホリという選択肢を考えるための比較と、よくある不安への答え」(`articles/working-holiday-after-rejection.html`)。渡航前準備カテゴリに追加。rei自身の実体験(GPA1.19→交換留学全落ち→ワーホリ選択)がベース。index.html・category/pre-departure.html・sitemap.xmlに反映済み
- [x] 新記事追加(2026-08-31): 「オーストラリアワーホリ、ビザ申請の条件・必要書類・手順を全部まとめました」(`articles/working-holiday-visa-guide.html`)。渡航前準備カテゴリに追加。日本ワーキングホリデー協会・オーストラリア移民局関連情報等をリサーチして作成。年齢条件(18〜30歳)・資金目安(AUD5,000)・申請料(AUD670)・ImmiAccountでの申請フロー・入国期限の2つの12ヶ月ルール・渡航前後の全体タイムラインを整理。index.html・category/pre-departure.html・sitemap.xmlに反映済み、記事数15本に更新
- [x] 新記事追加(2026-08-31): 「IELTS独学対策、4.0から6.0まで上げた方法」(`articles/ielts-study-guide.html`)。英語学習サービスカテゴリに追加。楽天(過去問Cambridge IELTS19・IDP公認問題集・文脈で覚えるIELTS英単語、いずれも実際使用)+ネイティブキャンプ(a8mat=4BAITN+DBVECY+35VG+6B70H、スピーキング4.0→5.5の実体験)のアフィリンクを掲載。index.html・category/english-learning.html・sitemap.xmlに反映済み、記事数14本に更新

## 進め方の提案

A・B・Dは完了。**残っているのはCセクション(実体験の追記)のみ**です。急ぎではないので、実際に体験したタイミングで都度教えてもらえれば反映します。
