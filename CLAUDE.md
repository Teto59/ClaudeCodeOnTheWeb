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

## Phase 3: Gemini AI統合 ✅ 完了

### 実装内容

#### 1. ファイル構成の追加
```
/
├── index.html        # メインHTMLファイル（ヘッダーにボタン2つ、モーダル2つ追加）
├── style.css         # スタイルシート（モーダル、チャットUIのスタイル追加）
├── app.js            # JavaScript（経済ロジック）
├── gemini-chat.js    # 新規追加：Gemini API連携
├── README.md         # プロジェクト説明
└── CLAUDE.md         # このファイル（開発引き継ぎドキュメント）
```

#### 2. 主要機能

##### ⚙️ API設定システム
- **2つの明確なボタン**: ヘッダーに「⚙️ API設定」と「🤖 AIに質問」の2つのボタンを配置
- **LocalStorage活用**: 公開リポジトリのため、APIキーはブラウザのLocalStorageに保存
- **APIキー検証**: AIzaで始まる正しい形式かチェック
- **視覚的フィードバック**: 保存成功/失敗を色分けして表示

##### 🤖 AI経済アドバイザー
- **Google Gemini API統合**: `gemini-2.0-flash-exp` モデルを使用（最新の安定版）
- **2人の経済学者の知見を統合**: クルーグマン（理論的）とレヴィット（データ分析）の視点
- **経済状態のコンテキスト共有**: 現在の8つの経済指標とターン数をAIに自動送信
- **チャットUI**: ユーザーメッセージ（右寄せ、紫グラデーション）とAI応答（左寄せ、白背景）を区別

#### 3. 技術スタック

- **Google Generative AI SDK**: UMD CDN経由で読み込み（ES Modulesを使用せず、グローバルスコープで動作）
```html
<script src="https://cdn.jsdelivr.net/npm/@google/generative-ai"></script>
```

- **モデル名**: `gemini-2.0-flash-exp`（gemini-proは非推奨のため更新）

#### 4. システムプロンプト

AIに以下の人格を設定：

```javascript
const SYSTEM_PROMPT = `
あなたは2人の著名な経済学者の知見を統合したAIアシスタントです：

【ポール・クルーグマン】
- 国際貿易、マクロ経済学の専門家
- 理論的アプローチ（IS-LMモデル、マンデル=フレミング・モデル、フィリップス曲線など）
- やや辛口で、グローバル視点を重視
- 歴史的事例（プラザ合意、欧州債務危機、アジア通貨危機など）を引用
- 貿易政策には特に慎重で、保護主義に懐疑的

【スティーヴン・レヴィット】
- 行動経済学、データ分析の専門家
- インセンティブと意図しない結果に注目
- 皮肉的で、意外性のある視点を提供
- 具体的なデータ（「60%増える」「20%の人々」など）を引用
- 比喩表現（「経済のダイエット」「政策のドーピング」など）を使用
- 一般常識に疑問を投げかける

【あなたの役割】
1. ユーザーの経済政策に関する質問に、両方の視点を統合して回答してください
2. 理論的説明（クルーグマン風）と実践的データ（レヴィット風）の両方を含めてください
3. 政策の長期的影響と短期的影響を区別してください
4. 必要に応じて、意図しない結果や隠れたコストについても言及してください
5. 回答は簡潔に、2-4段落程度にまとめてください
6. 日本語で回答してください

現在のシミュレーション状態は、ユーザーのメッセージの末尾に [経済指標] として追加されます。
`;
```

#### 5. UI/UX設計

**ヘッダーレイアウト**:
```css
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-buttons {
    display: flex;
    gap: 1rem;
}
```

**2つのモーダル**:
1. **API設定モーダル**: シンプルな入力フォーム（500px幅）
2. **AI質問モーダル**: 大きなチャットUI（800px幅、80vh高さ）

**チャットメッセージスタイル**:
- **ユーザーメッセージ**: 紫グラデーション、右寄せ、白文字
- **AIメッセージ**: 白背景、左寄せ、黒文字、シャドウ付き
- **システムメッセージ**: 黄色背景、中央寄せ（エラー表示用）

#### 6. 主要関数

**gemini-chat.js の主要関数**:
- `openApiSettings()`: API設定モーダルを開く
- `saveApiKey()`: APIキーをLocalStorageに保存し、Gemini APIを初期化
- `openAiChat()`: AIチャットモーダルを開く（APIキー未設定なら設定画面へ誘導）
- `initializeGemini(apiKey)`: Gemini APIを初期化
- `startNewChatSession()`: 新しいチャットセッションを開始（システムプロンプト適用）
- `sendMessage()`: ユーザーメッセージを送信し、AIの応答を表示
- `addChatMessage(type, content)`: チャットエリアにメッセージを追加

#### 7. エラーハンドリング

- **APIキー未設定**: アラートで通知し、API設定画面へ誘導
- **APIキー形式エラー**: 「AIzaで始まる必要があります」と表示
- **API呼び出しエラー**: 具体的なエラーメッセージを表示（quota制限、モデル不存在など）
- **ネットワークエラー**: システムメッセージで表示

#### 8. レスポンシブ対応

モバイル表示時:
- ヘッダーボタンが縦並びに変更
- モーダルが画面の95%幅に拡大
- チャットメッセージの左右マージンを調整（20% → 10%）

#### 9. UX改善ポイント

- **Enterキーで送信**: チャット入力欄でEnterキーを押すと送信
- **自動スクロール**: 新しいメッセージが追加されると自動的に最下部へスクロール
- **送信中の視覚的フィードバック**: 送信ボタンが「送信中...」に変化し、無効化
- **モーダル外クリックで閉じる**: モーダルの外側をクリックすると閉じる
- **起動時の自動初期化**: LocalStorageにAPIキーがあれば自動的にGemini APIを初期化

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
**開発ブランチ（Phase 3）**: `claude/gemini-chat-v2`
**次回開発時の注意**: このドキュメントを読んで、現在の実装状況を把握してから作業を開始してください。
