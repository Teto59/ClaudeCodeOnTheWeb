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
let chatInitialized = false;

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
async function initializeGemini(apiKey) {
    try {
        console.log('Gemini初期化開始...');
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log('Gemini初期化成功');
        return true;
    } catch (error) {
        console.error("Gemini initialization error:", error);
        return false;
    }
}

// チャットコンテナのクリア
function clearChatContainer() {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
    chatInitialized = false;
}

// 初期メッセージの表示
function showWelcomeMessage() {
    if (!chatInitialized) {
        addMessage('ai', 'こんにちは！経済政策について質問してください。クルーグマンとレヴィットの視点から分析します。\n\n現在の経済状態を考慮したアドバイスを提供できます。');
        chatInitialized = true;
    }
}

// モーダル制御
window.openGeminiChat = function() {
    console.log('openGeminiChat呼び出し');
    const apiKey = getApiKey();

    if (!apiKey) {
        console.log('API Keyが未設定、設定画面を開く');
        openApiKeyModal();
        return;
    }

    // API Keyがある場合
    console.log('API Keyが設定済み、チャットを開く');

    // Geminiの初期化確認
    if (!genAI || !model) {
        console.log('Geminiを初期化...');
        initializeGemini(apiKey).then(success => {
            if (success) {
                openChatModal();
            } else {
                alert('Gemini APIの初期化に失敗しました。API Keyを確認してください。');
                removeApiKey();
                openApiKeyModal();
            }
        });
    } else {
        openChatModal();
    }
};

function openChatModal() {
    const modal = document.getElementById('gemini-modal');
    if (modal) {
        modal.classList.add('active');
        showWelcomeMessage();
    }
}

window.closeGeminiChat = function() {
    const modal = document.getElementById('gemini-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

function openApiKeyModal() {
    const modal = document.getElementById('api-key-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

window.closeApiKeyModal = function() {
    const modal = document.getElementById('api-key-modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// API Key保存
window.saveApiKey = async function() {
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        alert('API Keyを入力してください。');
        return;
    }

    if (!apiKey.startsWith('AIza')) {
        alert('無効なAPI Keyです。正しいAPI Keyを入力してください。\n(API Keyは"AIza"で始まります)');
        return;
    }

    console.log('API Keyを保存...');
    setApiKey(apiKey);

    // Gemini初期化
    const success = await initializeGemini(apiKey);

    if (success) {
        console.log('初期化成功、モーダルを閉じてチャットを開く');
        apiKeyInput.value = '';
        closeApiKeyModal();

        // チャットをクリアして開く
        clearChatContainer();

        // 少し待ってからチャットモーダルを開く
        setTimeout(() => {
            openChatModal();
        }, 100);
    } else {
        alert('API Keyの初期化に失敗しました。正しいAPI Keyを入力してください。');
        removeApiKey();
    }
};

// チャットメッセージ追加
function addMessage(type, text) {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) {
        console.error('チャットコンテナが見つかりません');
        return null;
    }

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
    if (!chatContainer) {
        console.error('チャットコンテナが見つかりません');
        return null;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message loading';
    messageDiv.innerHTML = '<p>💭 考え中...</p>';
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageDiv;
}

// 経済状態の取得
function getEconomicContext() {
    // app.jsのeconomicStateにアクセス
    if (typeof economicState !== 'undefined' && typeof currentTurn !== 'undefined') {
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

    if (!message) {
        console.log('空のメッセージ、送信しない');
        return;
    }

    console.log('メッセージ送信:', message);

    // ユーザーメッセージを追加
    addMessage('user', message);

    // 入力欄をクリア
    input.value = '';

    // 送信ボタンを無効化
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.disabled = true;
    }

    // ローディング表示
    const loadingMsg = addLoadingMessage();

    try {
        // モデルの確認
        if (!model) {
            throw new Error('Gemini APIが初期化されていません');
        }

        // 経済状態を取得
        const economicContext = getEconomicContext();

        // プロンプトを構築
        const fullPrompt = `${SYSTEM_PROMPT}\n\n${economicContext}\n\nユーザーの質問: ${message}`;

        console.log('Gemini APIを呼び出し...');

        // Gemini APIを呼び出し
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini APIからの応答を受信');

        // ローディングを削除
        if (loadingMsg) {
            loadingMsg.remove();
        }

        // AIの回答を追加
        addMessage('ai', text);

    } catch (error) {
        console.error('Gemini API error:', error);

        // ローディングを削除
        if (loadingMsg) {
            loadingMsg.remove();
        }

        // エラーメッセージを表示
        let errorMessage = 'エラーが発生しました。';

        if (error.message.includes('API key') || error.message.includes('API_KEY')) {
            errorMessage = '⚠️ API Keyが無効です。設定を確認してください。\n\nヘッダーの「Geminiに質問する」ボタンから再設定できます。';
            removeApiKey();
            genAI = null;
            model = null;
        } else if (error.message.includes('quota') || error.message.includes('QUOTA')) {
            errorMessage = '⚠️ API利用制限に達しました。しばらく待ってから再試行してください。';
        } else if (error.message.includes('初期化')) {
            errorMessage = '⚠️ Gemini APIが初期化されていません。ページを更新してください。';
        } else {
            errorMessage = `⚠️ エラー: ${error.message}`;
        }

        addMessage('ai', errorMessage);
    } finally {
        // 送信ボタンを有効化
        if (sendBtn) {
            sendBtn.disabled = false;
        }
    }
};

// Enterキーでメッセージ送信
window.handleChatKeypress = function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
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
    console.log('DOMContentLoaded: gemini-chat.js初期化');

    const apiKey = getApiKey();
    if (apiKey) {
        console.log('保存されたAPI Keyを使用してGeminiを初期化');
        initializeGemini(apiKey);
    } else {
        console.log('API Keyが未設定');
    }
});

// デバッグ用
console.log('gemini-chat.js読み込み完了');
