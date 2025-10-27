# Economic Policy Simulator

経済政策の意思決定をシミュレートし、その影響を視覚的に学べるWebアプリケーション

![Economic Policy Simulator](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 概要

**Economic Policy Simulator**は、ユーザーが一国の経済政策立案者として、金融政策、財政政策、貿易政策、為替政策を決定し、その影響をリアルタイムで学べる教育的なシミュレーションツールです。

### 主な機能

- **4つの政策カテゴリ**
  - 💰 金融政策（金利調整）
  - 🏛️ 財政政策（政府支出調整）
  - 🌐 貿易政策（関税調整）
  - 💱 為替政策（為替介入）

- **8つの経済指標のリアルタイム表示**
  - GDP成長率、インフレ率、失業率、金利、為替レート、貿易収支、政府支出、関税率

- **経済学者の解説システム**
  - 🌍 ポール・クルーグマン（国際貿易・マクロ経済学）
  - 💡 スティーヴン・レヴィット（行動経済学・データ分析）

- **AI政策分析機能（NEW!）**
  - 🤖 Gemini AIによる経済状況の分析と政策提案

- **グラフ表示**
  - Chart.jsによる経済指標の推移グラフ

## デモ

🌐 [GitHub Pagesでデモを見る](https://teto59.github.io/ClaudeCodeOnTheWeb/)

## 使い方

### 1. 基本的な使い方

1. 左サイドバーの政策ボタンをクリック
2. 経済指標の変化を確認
3. 経済学者たちの解説を読む
4. グラフで推移を確認

### 2. AI政策分析機能の使い方（おすすめ！）

AI政策分析機能を使うと、Gemini AIが現在の経済状況を分析し、科学的・経済学的に妥当な政策を提案してくれます。

#### 事前準備: Gemini API Keyの取得

1. **Google AI Studioにアクセス**
   - [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
   - Googleアカウントでログイン

2. **API Keyを作成**
   - 「Create API Key」をクリック
   - 既存のGoogle Cloud Projectを選択するか、新しいプロジェクトを作成
   - API Keyが生成されます（`AIza...` で始まる文字列）

3. **API Keyをコピー**
   - 生成されたAPI Keyをコピー（後で使います）

#### API Keyの設定方法

1. **アプリを開く**
   - Economic Policy Simulatorのページを開く

2. **設定モーダルを開く**
   - 画面右上の「⚙️ API設定」ボタンをクリック

3. **API Keyを入力**
   - 「Gemini API Key」の入力欄に、先ほどコピーしたAPI Keyを貼り付け
   - 「保存」ボタンをクリック

4. **完了**
   - 「✓ API Keyが設定されています」と表示されれば成功！

#### AI分析の実行

1. 経済政策をいくつか実行して、経済状況を変化させる（任意）
2. メインエリアの「🤖 AI経済政策分析」セクションにある「🔍 政策を分析する」ボタンをクリック
3. Gemini AIが現在の経済状況を分析し、提案を表示します

**分析内容:**
- 現在の経済状況の評価
- 主な問題点の特定
- 金融政策、財政政策、貿易政策、為替政策の具体的な提案
- 経済学的根拠と予想される効果
- 政策のリスクや副作用

## セキュリティとプライバシー

### API Keyの安全性

- **ブラウザのみに保存**: API KeyはブラウザのLocalStorageに保存され、GitHubリポジトリやサーバーには送信されません
- **第三者に共有しない**: API Keyは他人に共有しないでください
- **削除可能**: いつでも「⚙️ API設定」から削除できます

### データの取り扱い

- 経済指標データはGemini APIに送信されますが、個人情報は含まれません
- API Keyは暗号化されずにLocalStorageに保存されます（ブラウザのセキュリティに依存）
- シークレットモードで使用した場合、ブラウザを閉じるとAPI Keyは削除されます

## 技術スタック

- **HTML5**: 基本構造
- **CSS3**: レスポンシブデザイン、グラデーション、アニメーション
- **Vanilla JavaScript**: 状態管理、DOM操作
- **Chart.js 4.4.0**: 経済指標の推移グラフ（CDN経由）
- **Gemini API**: AI政策分析（Google AI）

## ローカルでの動作確認

```bash
# リポジトリをクローン
git clone https://github.com/Teto59/ClaudeCodeOnTheWeb.git
cd ClaudeCodeOnTheWeb

# シンプルなHTTPサーバーを起動
python3 -m http.server 8000

# ブラウザで http://localhost:8000 を開く
```

## 開発ロードマップ

- ✅ Phase 1: プロジェクト立ち上げ＆基本UI
- ✅ Phase 2: 経済学者解説システム
- ✅ Phase 3: Gemini API統合（AI政策分析）
- 🔲 Phase 4: 複数国間の貿易・外交システム
- 🔲 Phase 5: 経済ショックイベント（不況、好況、災害など）
- 🔲 Phase 6: セーブ/ロード機能

## ライセンス

MIT License

## 開発者向け情報

詳細な開発情報は[CLAUDE.md](./CLAUDE.md)を参照してください。

## トラブルシューティング

### API Keyが動作しない場合

1. API Keyが正しい形式か確認（`AIza...` で始まる）
2. Google AI StudioでAPI Keyが有効か確認
3. ブラウザのコンソールでエラーメッセージを確認
4. API Keyを削除して、再度設定してみる

### AIの分析が遅い場合

- Gemini APIは通常5-10秒程度かかります
- ネットワーク接続を確認してください

### API Keyを忘れた場合

- Google AI Studioで新しいAPI Keyを作成してください
- 古いAPI Keyは削除することをおすすめします

## お問い合わせ

バグ報告や機能リクエストは[Issues](https://github.com/Teto59/ClaudeCodeOnTheWeb/issues)までお願いします。

---

**Enjoy learning economics!** 🌍📊💰
