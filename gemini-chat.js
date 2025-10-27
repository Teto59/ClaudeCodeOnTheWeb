import { GoogleGenerativeAI } from "@google/generative-ai";

// システムプロンプト
const SYSTEM_PROMPT = `
あなたは2人の著名な経済学者の知見を統合したAIアシスタントです：

【ポール・クルーグマン】
- 国際貿易、マクロ経済学の専門家
- 理論的アプローチ（IS-LMモデル、マンデル=フレミング・モデル、フィリップス曲線など）
- 歴史的事例の引用（プラザ合意、欧州債務危機、リーマンショックなど）
- やや辛口で現実主義的
- グローバルな視点
- ケインジアン経済学の支持者

【スティーヴン・レヴィット】
- 行動経済学、データ分析の専門家
- インセンティブと意図しない結果に注目
- 具体的なデータと統計を引用（「60%増加」など）
- 比喩表現を多用（「ダイエット」「ドーピング」「麻薬」など）
- 皮肉的で意外性を重視
- 因果関係とインセンティブ設計の専門家

ユーザーから経済政策に関する質問を受けたら：
1. 両方の視点から分析してください
2. 理論とデータの両面から説明してください
3. 歴史的事例や具体例を引用してください
4. 短期的影響と長期的影響を区別してください
5. 科学的・経済学的に妥当な提案を提示してください
6. 意図しない結果やトレードオフについても言及してください

回答は以下の形式で：
- クルーグマンの視点（理論的・グローバル）
- レヴィットの視点（データ・インセンティブ）
- 総合的な推奨事項

言語は日本語で、専門用語も分かりやすく説明してください。
`;

// グローバル変数
let genAI = null;
let model = null;
let chatHistory = [];

// API Key管理
function getApiKey() {
    return localStorage.getItem('gemini_api_key');
}

function setApiKey(key) {
    localStorage.setItem('gemini_api_key', key);
}

function removeApiKey() {
    localStorage.removeItem('gemini_api_key');
}

// Gemini AI初期化
function initializeGemini(apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        return true;
    } catch (error) {
        console.error("Gemini initialization error:", error);
        return false;
    }
}

// モーダル制御
window.openGeminiChat = function() {
    const apiKey = getApiKey();

    if (!apiKey) {
        // API Keyが設定されていない場合は設定画面を開く
        openApiKeyModal();
    } else {
        // API Keyがあればチャットを開く
        if (!genAI) {
            initializeGemini(apiKey);
        }
        document.getElementById('gemini-modal').classList.add('active');

        // チャット履歴が空なら初期メッセージを表示
        if (chatHistory.length === 0) {
            addMessage('ai', 'こんにちは！経済政策について質問してください。クルーグマンとレヴィットの視点から分析します。');
        }
    }
};

window.closeGeminiChat = function() {
    document.getElementById('gemini-modal').classList.remove('active');
};

function openApiKeyModal() {
    document.getElementById('api-key-modal').classList.add('active');
}

window.closeApiKeyModal = function() {
    document.getElementById('api-key-modal').classList.remove('active');
};

// API Key保存
window.saveApiKey = function() {
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        alert('API Keyを入力してください。');
        return;
    }

    if (!apiKey.startsWith('AIza')) {
        alert('無効なAPI Keyです。正しいAPI Keyを入力してください。');
        return;
    }

    setApiKey(apiKey);

    // Gemini初期化
    if (initializeGemini(apiKey)) {
        closeApiKeyModal();
        openGeminiChat();
        apiKeyInput.value = '';
    } else {
        alert('API Keyの初期化に失敗しました。正しいAPI Keyを入力してください。');
    }
};

// チャットメッセージ追加
function addMessage(type, text) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    // Markdown形式の簡易変換
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // **太字**
        .replace(/\n/g, '<br>');  // 改行

    messageDiv.innerHTML = `<p>${formattedText}</p>`;
    chatContainer.appendChild(messageDiv);

    // 自動スクロール
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return messageDiv;
}

// ローディングメッセージ
function addLoadingMessage() {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message loading';
    messageDiv.innerHTML = '<p>考え中...</p>';
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageDiv;
}

// 経済状態の取得
function getEconomicContext() {
    // app.jsのeconomicStateにアクセス
    if (typeof economicState !== 'undefined') {
        return `
【現在の経済状態】
- GDP成長率: ${economicState.gdpGrowth.toFixed(1)}%
- インフレ率: ${economicState.inflation.toFixed(1)}%
- 失業率: ${economicState.unemployment.toFixed(1)}%
- 金利: ${economicState.interestRate.toFixed(1)}%
- 為替レート: ${economicState.exchangeRate.toFixed(0)} (対ドル)
- 貿易収支: ${economicState.tradeBalance.toFixed(0)}億
- 政府支出: ${economicState.governmentSpending.toFixed(0)}億
- 関税率: ${economicState.tariffRate.toFixed(1)}%
- 現在のターン: ${currentTurn}

この経済状態を考慮して回答してください。
`;
    }
    return '';
}

// メッセージ送信
window.sendMessage = async function() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // ユーザーメッセージを追加
    addMessage('user', message);
    chatHistory.push({ role: 'user', text: message });

    // 入力欄をクリア
    input.value = '';

    // 送信ボタンを無効化
    const sendBtn = document.querySelector('.send-btn');
    sendBtn.disabled = true;

    // ローディング表示
    const loadingMsg = addLoadingMessage();

    try {
        // 経済状態を取得
        const economicContext = getEconomicContext();

        // プロンプトを構築
        const fullPrompt = `${SYSTEM_PROMPT}\n\n${economicContext}\n\nユーザーの質問: ${message}`;

        // Gemini APIを呼び出し
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // ローディングを削除
        loadingMsg.remove();

        // AIの回答を追加
        addMessage('ai', text);
        chatHistory.push({ role: 'ai', text: text });

    } catch (error) {
        console.error('Gemini API error:', error);

        // ローディングを削除
        loadingMsg.remove();

        // エラーメッセージを表示
        let errorMessage = 'エラーが発生しました。';

        if (error.message.includes('API key')) {
            errorMessage = 'API Keyが無効です。設定を確認してください。';
            removeApiKey();
        } else if (error.message.includes('quota')) {
            errorMessage = 'API利用制限に達しました。しばらく待ってから再試行してください。';
        } else {
            errorMessage = `エラー: ${error.message}`;
        }

        addMessage('ai', errorMessage);
    } finally {
        // 送信ボタンを有効化
        sendBtn.disabled = false;
    }
};

// Enterキーでメッセージ送信
window.handleChatKeypress = function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
};

// モーダル外クリックで閉じる
window.addEventListener('click', function(event) {
    const geminiModal = document.getElementById('gemini-modal');
    const apiKeyModal = document.getElementById('api-key-modal');

    if (event.target === geminiModal) {
        closeGeminiChat();
    }

    if (event.target === apiKeyModal) {
        closeApiKeyModal();
    }
});

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = getApiKey();
    if (apiKey) {
        initializeGemini(apiKey);
    }
});
