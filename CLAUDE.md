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

## 次のフェーズで実装予定の機能

### Phase 3（予定）
- 複数国間の貿易・外交システム
- 他国のAI動作
- 経済ショックイベント（不況、好況、災害など）
- より詳細な経済指標（株価、地価、債券利回りなど）

### Phase 4（予定）
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
**次回開発時の注意**: このドキュメントを読んで、現在の実装状況を把握してから作業を開始してください。
