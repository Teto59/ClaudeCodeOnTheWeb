# Economic Policy Simulator - 開発ドキュメント

## プロジェクト概要
**プロジェクト名**: Economic Policy Simulator
**目的**: ユーザーが1つの国の指導者として経済政策を決定し、その影響を視覚的に学べるWebアプリケーション
**公開方法**: GitHub Pages
**開発ブランチ**: `claude/init-economic-simulator-011CUTcqP6zef55zgcMFpC5H`

---

## Phase 1: プロジェクト立ち上げ＆基本UI ✅ 完了

### 実装内容

#### 1. ファイル構成
```
/
├── index.html    # メインHTMLファイル
├── style.css     # スタイルシート
├── app.js        # JavaScript（経済ロジック）
├── README.md     # プロジェクト説明
└── CLAUDE.md     # このファイル（開発引き継ぎドキュメント）
```

#### 2. レイアウト構成
- **ヘッダー**: タイトル「Economic Policy Simulator」と説明文
- **左サイドバー**: 政策選択エリア（4カテゴリの政策ボタン）
- **メインエリア**: 8つの経済指標表示 + Chart.jsによる推移グラフ
- **右サイドバー**: 経済学者の解説エリア + ターン情報 + リセットボタン

#### 3. 経済指標（初期値）
| 指標 | 初期値 | 単位 |
|------|--------|------|
| GDP成長率 | 2.5 | % |
| インフレ率 | 2.0 | % |
| 失業率 | 5.0 | % |
| 金利 | 3.0 | % |
| 為替レート | 100 | 対ドル |
| 貿易収支 | 0 | 億 |
| 政府支出 | 1000 | 億 |
| 関税率 | 5.0 | % |

#### 4. 実装済み政策

##### 💰 金融政策
- **金利を上げる (+0.5%)**
  - GDP成長率: -0.3%
  - インフレ率: -0.4%
  - 失業率: +0.2%
  - 為替レート: -3（通貨高）

- **金利を下げる (-0.5%)**
  - GDP成長率: +0.4%
  - インフレ率: +0.3%
  - 失業率: -0.2%
  - 為替レート: +3（通貨安）

##### 🏛️ 財政政策
- **政府支出を増やす (+100億)**
  - GDP成長率: +0.5%
  - インフレ率: +0.3%
  - 失業率: -0.3%

- **政府支出を減らす (-100億)**
  - GDP成長率: -0.4%
  - インフレ率: -0.2%
  - 失業率: +0.3%

##### 🌐 貿易政策
- **関税を上げる (+2%)**
  - 貿易収支: +50億
  - インフレ率: +0.2%
  - GDP成長率: -0.2%

- **関税を下げる (-2%)**
  - 貿易収支: -50億
  - インフレ率: -0.1%
  - GDP成長率: +0.3%

##### 💱 為替政策
- **自国通貨買い（通貨高）**
  - 為替レート: -5
  - インフレ率: -0.3%
  - 貿易収支: -80億
  - GDP成長率: -0.2%

- **自国通貨売り（通貨安）**
  - 為替レート: +5
  - インフレ率: +0.3%
  - 貿易収支: +80億
  - GDP成長率: +0.3%

#### 5. 技術スタック
- **HTML5**: 基本構造
- **CSS3**: レスポンシブデザイン、グラデーション
- **Vanilla JavaScript**: 状態管理、DOM操作
- **Chart.js 4.4.0**: 経済指標の推移グラフ（CDN経由）

#### 6. 主要機能
- ✅ 政策ボタンクリックで経済指標が変化
- ✅ 各政策実行後にターンが進む
- ✅ Chart.jsでGDP成長率、インフレ率、失業率、金利の推移をグラフ化
- ✅ 経済学者の解説が各政策の効果を説明
- ✅ リセットボタンで初期状態に戻る
- ✅ レスポンシブデザイン（モバイル対応）

---

## コードの主要部分

### 状態管理（app.js）
```javascript
let economicState = {
    gdpGrowth: 2.5,
    inflation: 2.0,
    unemployment: 5.0,
    interestRate: 3.0,
    exchangeRate: 100,
    tradeBalance: 0,
    governmentSpending: 1000,
    tariffRate: 5.0
};
```

### 政策実行の流れ
1. ユーザーが政策ボタンをクリック
2. 該当する関数（例: `adjustInterestRate()`）が実行
3. `economicState`の値が更新される
4. `nextTurn()`でターンが進み、履歴に記録
5. `updateDisplay()`で画面表示を更新
6. `updateChart()`でグラフを更新
7. `updateCommentary()`で経済学者の解説を表示

---

## GitHub Pages 設定手順

1. GitHubリポジトリの Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `claude/init-economic-simulator-011CUTcqP6zef55zgcMFpC5H`
4. Folder: `/ (root)`
5. Save

公開URL: `https://[username].github.io/ClaudeCodeOnTheWeb/`

---

## Phase 2: 経済学者解説システム ✅ 完了

### 実装内容

#### 1. 2人の経済学者キャラクター

##### 🌍 ポール・クルーグマン
- **専門**: 国際貿易・マクロ経済学
- **性格**: 理論的、やや辛口、グローバル視点
- **特徴**: 経済学の理論（マンデル=フレミング・モデル、比較優位など）を引用し、歴史的事例（プラザ合意、欧州債務危機など）を用いて解説

##### 💡 スティーヴン・レヴィット
- **専門**: 行動経済学・データ分析
- **性格**: 皮肉的、意外性を重視、具体例好き
- **特徴**: データを引用し（「60%増える」など）、意図しない結果や人々のインセンティブに注目。比喩表現（「ダイエット」「ドーピング」「麻薬」など）を使用

#### 2. UI/UXの実装

- 右サイドバーに2つの経済学者カードを縦配置
- クルーグマンのカード：緑系グラデーション（`#e8f5e9` → `#c8e6c9`）
- レヴィットのカード：青系グラデーション（`#e3f2fd` → `#bbdefb`）
- 各カードに経済学者のアイコン、名前、専門分野を表示
- ホバー時に浮き上がるエフェクト
- コメント更新時にフェードインアニメーション（0.5秒）

#### 3. 各政策に対するコメント

全8つの政策（金利上げ/下げ、政府支出増/減、関税上げ/下げ、通貨買い/売り）に対して、それぞれ2人の経済学者の独自のコメントを実装。

**特徴的なコメント例:**

- **クルーグマン（金利上げ）**: 「マンデル=フレミング・モデルそのものだ」
- **レヴィット（金利上げ）**: 「投資を先送りにする企業が60%増える」
- **クルーグマン（関税上げ）**: 「保護主義は両国を貧しくする、というのがリカードの時代からの教訓だ」
- **レヴィット（関税上げ）**: 「密輸が20%増加するデータもある」
- **クルーグマン（政府支出増）**: 「典型的なケインジアン政策だ」
- **レヴィット（政府支出増）**: 「支出の30%は非効率に使われる傾向がある」

#### 4. 技術実装

- `updateEconomistCommentary(krugmanComment, levittComment)` 関数で2人のコメントを同時更新
- アニメーションをリセットして再適用することでフェードイン効果を実現
- 各政策関数（`adjustInterestRate`、`adjustGovernmentSpending`、`adjustTariff`、`adjustExchangeRate`）で個別のコメントを生成
- リセット機能も2人のコメントに対応

#### 5. コードの主要変更点

**HTML（index.html）:**
```html
<!-- クルーグマンのカード -->
<div class="economist-card krugman-card">
    <div class="economist-header">
        <span class="economist-icon">🌍</span>
        <div class="economist-info">
            <h3>ポール・クルーグマン</h3>
            <p class="economist-specialty">国際貿易・マクロ経済学</p>
        </div>
    </div>
    <div class="economist-commentary" id="krugman-commentary">...</div>
</div>

<!-- レヴィットのカード -->
<div class="economist-card levitt-card">...</div>
```

**CSS（style.css）:**
```css
.krugman-card {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-left: 5px solid #4caf50;
}

.levitt-card {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-left: 5px solid #2196f3;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

**JavaScript（app.js）:**
```javascript
function updateEconomistCommentary(krugmanComment, levittComment) {
    const krugmanCommentary = document.getElementById('krugman-commentary');
    const levittCommentary = document.getElementById('levitt-commentary');

    // アニメーションをリセットして再適用
    krugmanCommentary.style.animation = 'none';
    levittCommentary.style.animation = 'none';

    setTimeout(() => {
        krugmanCommentary.innerHTML = krugmanComment;
        levittCommentary.innerHTML = levittComment;
        krugmanCommentary.style.animation = 'fadeIn 0.5s ease-in';
        levittCommentary.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}
```

---

## Phase 3: Gemini統合チャットシステム ✅ 完了

### 実装内容

#### 1. API Key管理システム

**採用方式：ユーザー入力 + LocalStorage保存**

公開リポジトリ（GitHub Pages）のため、サーバーサイドの環境変数が使えない。そのため、以下の方式を採用：

- ユーザーが自分のAPI Keyを取得・入力
- LocalStorageにブラウザローカルで保存
- 外部サーバーには送信されない
- 設定画面でいつでも削除可能

**セキュリティ対策：**
- 警告メッセージの表示
- 共有PC使用時の注意喚起
- パスワード入力フィールドでの非表示

**モデル名：**
- `gemini-2.5-pro` を使用（最新の安定版）
- 以前のgemini-proから更新

#### 2. UI/UX

##### a. ヘッダー右上の2つのボタン
```html
<div class="header-buttons">
    <button class="api-settings-btn">⚙️ API設定</button>
    <button class="gemini-chat-btn">🤖 Geminiに質問する</button>
</div>
```

**2ボタン方式の採用：**
- **⚙️ API設定**: APIキーの設定/削除専用ボタン
- **🤖 Geminiに質問する**: チャット機能へのアクセス

##### b. チャットモーダル
- モーダルウィンドウでチャット画面を表示
- チャット履歴エリア
- メッセージ入力欄と送信ボタン
- スクロール対応
- レスポンシブデザイン（モバイル対応）

##### c. API Key設定モーダル
- 初回アクセス時に表示
- Google AI Studioへのリンク
- API Key取得手順の説明
- 注意事項の表示
- パスワード入力フィールド

#### 3. システムプロンプト

2人の経済学者の視点を統合したシステムプロンプトを実装：

**クルーグマンの視点：**
- 理論的アプローチ（IS-LMモデル、マンデル=フレミング・モデル）
- 歴史的事例の引用（プラザ合意、欧州債務危機）
- ケインジアン経済学
- グローバルな視点

**レヴィットの視点：**
- データと統計の引用
- インセンティブと意図しない結果
- 比喩表現（「ダイエット」「ドーピング」など）
- 因果関係の分析

**回答形式：**
- クルーグマンの視点（理論的・グローバル）
- レヴィットの視点（データ・インセンティブ）
- 総合的な推奨事項

#### 4. 経済状態の統合

現在の経済シミュレーション状態をGeminiに送信：

```javascript
【現在の経済状態】
- GDP成長率: 2.5%
- インフレ率: 2.0%
- 失業率: 5.0%
- 金利: 3.0%
- 為替レート: 100 (対ドル)
- 貿易収支: 0億
- 政府支出: 1000億
- 関税率: 5.0%
- 現在のターン: 1
```

これにより、現在の状況を考慮した具体的なアドバイスが可能。

#### 5. 技術スタック

- **Gemini API**: `@google/generative-ai`（ES Modules経由）
- **LocalStorage**: API Key保存
- **Vanilla JavaScript**: チャット機能
- **CSS**: モーダル＆チャットUI
- **Import Maps**: ES Modulesのインポート

#### 6. ファイル構成

```
/
├── index.html       # ボタン＆モーダル追加
├── style.css        # モーダル＆チャットUIスタイル
├── app.js           # 既存の経済シミュレーション
├── gemini-chat.js   # 新規：Gemini統合とチャット機能
└── CLAUDE.md        # このファイル
```

#### 7. 主要機能

- ✅ API Key管理（LocalStorage）
- ✅ 初回設定画面
- ✅ チャット履歴表示
- ✅ メッセージ送受信
- ✅ ローディング表示
- ✅ エラーハンドリング
- ✅ 経済状態の自動送信
- ✅ システムプロンプト（2人の経済学者）
- ✅ レスポンシブ対応

#### 8. コードの主要部分

**JavaScript（gemini-chat.js）:**
```javascript
const SYSTEM_PROMPT = `
あなたは2人の著名な経済学者の知見を統合したAIアシスタントです：
【ポール・クルーグマン】...
【スティーヴン・レヴィット】...
`;

// API Key管理
function getApiKey() {
    return localStorage.getItem('gemini_api_key');
}

// Gemini初期化
function initializeGemini(apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
}

// メッセージ送信
async function sendMessage() {
    const economicContext = getEconomicContext();
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${economicContext}\n\nユーザーの質問: ${message}`;
    const result = await model.generateContent(fullPrompt);
    // ...
}
```

**CSS（style.css）:**
```css
.gemini-chat-btn {
    padding: 0.8rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 25px;
}

.modal {
    position: fixed;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.6);
}

.chat-message.user {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.chat-message.ai {
    background: #f0f0f0;
    color: #333;
}
```

#### 9. API Key取得手順（ユーザー向け）

1. [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたAPI Keyをコピー
5. アプリの設定画面に貼り付け

---

## 次のフェーズで実装予定の機能

### Phase 4（予定）
- 複数国間の貿易・外交システム
- 他国のAI動作
- 経済ショックイベント（不況、好況、災害など）
- より詳細な経済指標（株価、地価、債券利回りなど）

### Phase 5（予定）
- マルチプレイヤー対応
- セーブ/ロード機能
- 詳細な統計・ランキング
- 教育モード（経済学の基礎を学べるチュートリアル）

---

## 既知の制限事項
- 現在は単一国のシミュレーションのみ
- 経済モデルは簡易的なもので、実際の経済学的な複雑性は簡略化されている
- 政策の効果は即座に反映され、時間遅れは考慮されていない

---

## 開発者向けメモ

### ローカルでの動作確認
```bash
# シンプルなHTTPサーバーを起動
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

### コードの編集ポイント
- 経済指標の追加: `economicState`に新しいプロパティを追加
- 政策の追加: 新しい関数を作成し、`index.html`のボタンに`onclick`を設定
- グラフのカスタマイズ: `initChart()`内のChart.jsの設定を編集
- スタイル変更: `style.css`のカラースキーム、レイアウトを調整

---

**Phase 1 完了日**: 2025-10-25
**Phase 2 完了日**: 2025-10-25
**Phase 3 完了日**: 2025-10-27
**Phase 3 更新日**: 2025-10-27（gemini-2.5-pro + 2ボタンUI）
**Phase 3 リファクタリング**: 2025-10-27（モダンUI + 完全書き直し）
**Phase 3 バグ修正**: 2025-10-27（CDNライブラリ読み込み修正）
**開発ブランチ**: `claude/init-economic-simulator-011CUTcqP6zef55zgcMFpC5H`

---

## Phase 3リファクタリング: モダンUI + システム完全書き直し ✅ 完了

### 変更内容

#### 1. モダンなUI実装

**ヘッダーボタンのリデザイン:**
```html
<div class="header-actions">
    <!-- API設定ボタン：モダンなアイコンスタイル -->
    <button class="api-key-btn">
        <svg class="icon">...</svg>
        <span>API設定</span>
    </button>

    <!-- Geminiチャットボタン：元のスタイル維持＆強化 -->
    <button class="gemini-chat-btn">
        <span class="btn-icon">🤖</span>
        <span>Geminiに質問する</span>
    </button>
</div>
```

**デザインの特徴:**
- **API設定ボタン**: SVGアイコン、白背景、ボーダー、ホバーで紫に変化
- **Geminiボタン**: 元の紫グラデーション維持、ホバーで浮き上がるエフェクト強化
- **トランジション**: `cubic-bezier(0.4, 0, 0.2, 1)` でスムーズなアニメーション
- **レスポンシブ**: モバイルで縦並び、中央揃え

#### 2. gemini-chat.js完全書き直し

**アーキテクチャの改善:**
- **モジュール化**: 機能ごとにオブジェクトで分離（`ApiKeyManager`, `GeminiAPI`, `UI`, `EconomicStateHelper`）
- **エラーハンドリング強化**: 詳細なエラーメッセージと適切な処理
- **状態管理**: `State`オブジェクトで一元管理
- **非同期処理**: async/awaitでクリーンな処理フロー
- **バリデーション**: APIキーの詳細な検証

**主要オブジェクト:**
```javascript
// 設定
const CONFIG = {
    MODEL_NAME: 'gemini-2.5-pro',
    STORAGE_KEY: 'gemini_api_key',
    SYSTEM_PROMPT: '...'
};

// 状態管理
const State = {
    model: null,
    chatHistory: [],
    isInitialized: false,
    isProcessing: false
};

// API Key管理
const ApiKeyManager = {
    get(), set(), remove(), validate()
};

// Gemini API
const GeminiAPI = {
    async initialize(apiKey),
    async sendMessage(userMessage)
};

// UI管理
const UI = {
    Modal: { open(), close() },
    Chat: { clear(), addMessage(), showLoading(), removeLoading() },
    Input: { getValue(), setValue(), clear(), setDisabled() }
};

// 経済状態ヘルパー
const EconomicStateHelper = {
    getContext()
};
```

**改善されたエラーハンドリング:**
- APIキー未設定時の適切な誘導
- API呼び出しエラーの詳細な分類
- ネットワークエラー、Quota制限、モデル不存在などの個別対応
- 処理中の重複リクエスト防止

#### 3. CSS改善

**モダンなスタイル:**
```css
/* API設定ボタン */
.api-key-btn {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.api-key-btn:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

/* Geminiチャットボタン */
.gemini-chat-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gemini-chat-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}
```

---

## Phase 3バグ修正: CDNライブラリ読み込み問題の解決 ✅ 完了

### 問題
- ユーザーがAPIキーを入力しても「❌ GoogleGenerativeAI is not defined」エラーが発生
- CDNからのライブラリ読み込みが正しく動作していなかった

### 原因
- `@google/generative-ai`パッケージはブラウザで直接UMD形式を提供していない
- ESM形式のみが提供されているため、従来のscriptタグでは読み込めなかった

### 解決策

**1. ESM版をグローバルに公開（index.html）**
```html
<script type="module">
    import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
    window.GoogleGenerativeAI = GoogleGenerativeAI;
    console.log('✅ GoogleGenerativeAI loaded');
</script>
```

**2. ライブラリロード待機処理（gemini-chat.js）**
```javascript
const GeminiAPI = {
    // ライブラリのロードを待つ
    async waitForLibrary(maxWait = 5000) {
        const startTime = Date.now();
        while (typeof GoogleGenerativeAI === 'undefined') {
            if (Date.now() - startTime > maxWait) {
                throw new Error('Gemini APIライブラリの読み込みがタイムアウトしました');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('✅ GoogleGenerativeAI is ready');
    },

    async initialize(apiKey) {
        await this.waitForLibrary(); // ロードを待つ
        // ...
    }
};
```

**3. defer属性の追加**
```html
<script src="gemini-chat.js" defer></script>
```

### 技術的詳細
- ESM形式のライブラリをインポートし、`window`オブジェクトに公開
- 最大5秒間、100msごとにライブラリのロードをチェック
- タイムアウト時は適切なエラーメッセージを表示
- `defer`属性でDOMロード後にスクリプトを実行

### 結果
✅ APIキーの入力と初期化が正常に動作
✅ エラーハンドリングも適切に機能
✅ ユーザー体験の向上

### 追加修正: モデル名の変更

**問題:**
- メッセージ送信後、「考え中...」から返答が返ってこない
- モデル名「gemini-2.5-pro」が存在しない

**解決策:**
- モデル名を `gemini-2.5-pro` に変更（Google公式の最新安定版）
- エラーログを強化して詳細なデバッグ情報を出力
- 404エラー、API key無効、quota制限などを詳細に分類

**利用可能なモデル:**
- `gemini-2.5-flash` - 高速版（デフォルト・レート制限緩い）
- `gemini-2.5-pro` - 最新の安定版（高品質・レート制限厳しい）

---

## Phase 3アップデート: モデル選択機能の追加 ✅ 完了

### 実装内容

#### 1. モデル選択UI
- API設定モーダルにモデル選択ドロップダウンを追加
- gemini-2.5-flash（デフォルト・高速・レート制限緩い）
- gemini-2.5-pro（高品質・レート制限厳しい）

#### 2. ModelManager実装
- LocalStorageにモデル選択を保存
- getCurrentModel()で選択されたモデルを取得
- デフォルトはgemini-2.5-flash

#### 3. エラーメッセージの改善
- 503エラー時: "レートリミットに達しました。しばらく待ってから再度試行してください。"
- 存在しないモデル名（gemini-1.5-pro, gemini-1.5-flash）をすべて削除

#### 4. 技術実装
```javascript
// ModelManager
const ModelManager = {
    get() { return localStorage.getItem(CONFIG.STORAGE_KEY_MODEL) || CONFIG.DEFAULT_MODEL; },
    set(modelName) { localStorage.setItem(CONFIG.STORAGE_KEY_MODEL, modelName); },
    getCurrentModel() { return this.get(); }
};

// 動的なモデル選択
const currentModel = ModelManager.getCurrentModel();
const response = await State.ai.models.generateContent({
    model: currentModel,
    contents: fullPrompt
});
```

**実装日**: 2025-10-27

---

## Phase 4: 政府債務システム ✅ 完了

### 実装概要
レイ・ダリオの債務サイクル理論（"Principles for Dealing with the Changing World Order", "Principles for Navigating Big Debt Crises"）を統合した、政府債務シミュレーションシステムを実装。

### 1. 新しい経済指標（債務関連）

| 指標 | 初期値 | 単位 | 説明 |
|------|--------|------|------|
| 政府債務残高 | 2000 | 億 | 累積債務（国債発行総額） |
| 名目GDP | 10000 | 億 | 実質GDP×物価水準 |
| 債務対GDP比率 | 200 | % | 債務残高÷名目GDP×100 |
| 利払い費 | 60 | 億/年 | 債務残高×金利 |
| 税収 | 1000 | 億/年 | 政府の年間税収 |
| 財政収支 | -60 | 億/年 | 税収 - 政府支出 - 利払い費 |

### 2. 債務の動態シミュレーション

**毎ターン自動計算される項目：**
```javascript
// 1. 名目GDPの更新
名目GDP = 名目GDP × (1 + GDP成長率/100) × (1 + インフレ率/100)

// 2. 利払い費の計算
利払い費 = 債務残高 × 金利 / 100

// 3. 財政収支の計算
財政収支 = 税収 - 政府支出 - 利払い費

// 4. 債務残高の更新（赤字なら債務増加）
債務残高 += (-財政収支)

// 5. 債務対GDP比率の計算
債務対GDP比率 = (債務残高 / 名目GDP) × 100
```

### 3. r > g 問題（債務持続可能性）

**トマ・ピケティの不等式を応用：**
- **r（金利）> g（名目成長率）** の場合、債務対GDP比率が雪だるま式に増加
- 名目成長率 = GDP成長率 + インフレ率
- r > g の場合、警告ボックスを表示

### 4. 債務危機警告システム（ロゴフ・ラインハート研究）

**債務対GDP比率による分類：**
- 🟢 **健全**（< 90%）：正常な債務水準
- 🟡 **警告レベル**（90-150%）：財政規律が必要
- 🟠 **危機レベル**（150-250%）：早急な財政再建が必要
- 🔴 **破綻リスク**（> 250%）：デフォルトまたはハイパーインフレのリスク

### 5. 5つの債務政策

#### A. 国債発行（+500億）
**効果：**
- 債務残高: +500億
- 金利: +0.1%（供給増加）
- 為替レート: +1（財政悪化懸念で通貨安）

**解説：**
- 財政赤字のファイナンス手段
- 金利上昇でクラウディングアウトのリスク
- r > g の関係が重要

#### B. 増税（+5%）
**効果：**
- 税収: +5%
- GDP成長率: -0.3%（増税で消費減少）
- インフレ率: -0.2%（需要減少）

**解説：**
- 財政再建の正攻法、但しタイミングが重要
- 不況時の増税は経済を冷え込ませる
- ラッファー曲線：税率上昇で地下経済が拡大

#### C. 緊縮財政（-200億）
**効果：**
- 政府支出: -200億
- GDP成長率: -0.5%（需要減少）
- 失業率: +0.4%（公共部門の雇用削減）
- インフレ率: -0.3%

**解説：**
- 不況時には最悪の選択
- 欧州債務危機の教訓：ギリシャ、スペイン、ポルトガル
- Self-defeating austerity（自滅的緊縮）

#### D. 債務リストラクチャリング（-30%）
**効果：**
- 債務残高: -30%
- 金利: +2.0%（信用低下で金利急騰）
- 為替レート: +10（通貨急落）
- GDP成長率: -1.5%（信用危機）

**解説：**
- 事実上のデフォルト
- 国際市場から平均15年間締め出される
- アルゼンチン（2001年）、ギリシャ（2012年）の事例
- 最後の手段

#### E. 債務のマネタイゼーション
**効果：**
- 債務残高: -500億（中央銀行が引き受け）
- インフレ率: +1.5%（マネーサプライ増加）
- 為替レート: +5（通貨安）
- 金利: -0.3%（中銀購入）

**解説：**
- レイ・ダリオの「美しいデレバレッジング」の鍵
- 量的緩和（QE）の一形態
- 適度なら効果的、過度ならハイパーインフレ
- 名目GDP比30%超でインフレリスク急上昇

### 6. レイ・ダリオの「美しいデレバレッジング」理論

**4つのデレバレッジ要素：**
1. **緊縮財政（Austerity）** - 政府支出削減
2. **債務削減（Debt Restructuring）** - デフォルト
3. **富の再分配（Wealth Redistribution）** - 増税
4. **債務のマネタイゼーション（Debt Monetization）** - 中銀引受

**バランスが重要：**
適切な比率で4つを組み合わせることが、経済崩壊を防ぎながら債務を削減する鍵。

### 7. UI/UX 実装

#### A. 債務指標セクション
- 6つの債務指標を視覚的に表示
- オレンジ系グラデーション（`#fff3e0` → `#ffe0b2`）
- 財政収支の赤字/黒字を色分け表示

#### B. 債務メーター
- 債務対GDP比率を視覚化
- 0%から400%のスケール
- 90%, 150%, 250%の閾値を表示
- 比率に応じて色が変化（緑→黄→橙→赤）

#### C. r > g 警告ボックス
- 金利が名目成長率を上回る場合に表示
- 赤系グラデーション（`#ffebee` → `#ffcdd2`）
- 債務が持続不可能な軌道にあることを警告

#### D. 債務政策ボタン
- オレンジ系グラデーション（`#ff9800` → `#f57c00`）
- 危険な政策（債務リストラ、マネタイゼーション）は赤色

### 8. 経済学者のコメント

**各債務政策に対して2人の経済学者の視点：**

- **クルーグマン**：理論的アプローチ、歴史的事例、グローバル視点
  - 欧州債務危機、プラザ合意、IS-LMモデルなどを引用

- **レヴィット**：データと統計、インセンティブ、意図しない結果
  - 地下経済、脱税のインセンティブ、具体的な数値データ

### 9. 既存政策への影響追加

**政府支出を増やす：**
```javascript
// 新規追加
economicState.interestRate += 0.2;  // 国債発行増加→金利上昇
economicState.exchangeRate += 2;    // 財政悪化→通貨安
```

ユーザーの指摘通り、財政拡大は金利上昇と通貨安を招く現実的なメカニズムを実装。

### 10. 技術スタック

**変更ファイル：**
- `app.js`: +304行（債務動態計算、5つの債務政策関数、警告システム）
- `index.html`: +64行（債務指標セクション、債務政策ボタン）
- `style.css`: +153行（債務UI、メーター、警告ボックス）

**主要関数：**
- `calculateDebtDynamics()` - 債務の動態計算
- `updateDebtStatus()` - 債務危機レベル判定
- `updateDebtMeter()` - 債務メーター更新
- `updateRGWarning()` - r > g 警告
- `issueDebt()` - 国債発行
- `increaseTax()` - 増税
- `austerity()` - 緊縮財政
- `debtRestructuring()` - 債務リストラ
- `debtMonetization()` - 債務のマネタイゼーション

### 11. 参考文献・理論

- Ray Dalio - "Principles for Dealing with the Changing World Order" (2021)
- Ray Dalio - "Principles for Navigating Big Debt Crises" (2018)
- Carmen Reinhart & Kenneth Rogoff - "This Time is Different" (2009)
- Thomas Piketty - "Capital in the Twenty-First Century" (2013) - r > g 理論
- IMFの債務持続可能性分析（DSA）フレームワーク

### 12. 歴史的事例の引用

- **アルゼンチン債務危機**（2001年）- 債務リストラ
- **ギリシャ債務危機**（2012年）- 緊縮財政の失敗
- **欧州債務危機**（2010-2015年）- Self-defeating austerity
- **ワイマール共和国ハイパーインフレ**（1920年代）- 過度なマネタイゼーション
- **日本のデフレ**（1990年代-2010年代）- QEの実践
- **2008年リーマンショック後のQE**（アメリカ、EU、日本）

---

**Phase 4 実装日**: 2025-10-28
**開発ブランチ**: `claude/init-economic-simulator-011CUTcqP6zef55zgcMFpC5H`
**コミットID**: 0b0373f

---

**次回開発時の注意**: このドキュメントを読んで、現在の実装状況を把握してから作業を開始してください。
