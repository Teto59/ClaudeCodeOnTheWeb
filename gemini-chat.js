// Gemini Chat Integration for Economic Policy Simulator
// Uses UMD CDN - GoogleGenerativeAI is available globally

const GEMINI_API_KEY_STORAGE = 'gemini_api_key';
const GEMINI_MODEL = 'gemini-2.0-flash-exp'; // 最新の安定モデル

// システムプロンプト: 2人の経済学者の知見を統合
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

let genAI = null;
let model = null;
let chatSession = null;

// モーダル管理
function openApiSettings() {
    const modal = document.getElementById('api-settings-modal');
    const input = document.getElementById('api-key-input');
    const status = document.getElementById('api-status');

    // 既存のAPIキーを読み込み
    const savedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (savedKey) {
        input.value = savedKey;
    }

    status.textContent = '';
    status.className = 'api-status';
    modal.style.display = 'block';
}

function closeApiSettings() {
    const modal = document.getElementById('api-settings-modal');
    modal.style.display = 'none';
}

function saveApiKey() {
    const input = document.getElementById('api-key-input');
    const status = document.getElementById('api-status');
    const apiKey = input.value.trim();

    if (!apiKey) {
        status.textContent = 'APIキーを入力してください';
        status.className = 'api-status error';
        return;
    }

    // APIキーの形式チェック（AIzaで始まる）
    if (!apiKey.startsWith('AIza')) {
        status.textContent = 'APIキーの形式が正しくありません（AIzaで始まる必要があります）';
        status.className = 'api-status error';
        return;
    }

    try {
        // LocalStorageに保存
        localStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey);

        // Gemini APIを初期化
        initializeGemini(apiKey);

        status.textContent = 'APIキーを保存しました！';
        status.className = 'api-status success';

        // 2秒後にモーダルを閉じる
        setTimeout(() => {
            closeApiSettings();
        }, 2000);
    } catch (error) {
        status.textContent = `エラー: ${error.message}`;
        status.className = 'api-status error';
    }
}

function openAiChat() {
    const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);

    if (!apiKey) {
        alert('先にAPIキーを設定してください');
        openApiSettings();
        return;
    }

    // Gemini APIが初期化されていない場合は初期化
    if (!genAI) {
        initializeGemini(apiKey);
    }

    const modal = document.getElementById('ai-chat-modal');
    modal.style.display = 'block';

    // チャットが初めて開かれる場合は初期化メッセージを表示
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages.children.length === 0) {
        addChatMessage('system', 'AI経済アドバイザーが起動しました。経済政策について質問してください。');
        // 新しいチャットセッションを開始
        startNewChatSession();
    }
}

function closeAiChat() {
    const modal = document.getElementById('ai-chat-modal');
    modal.style.display = 'none';
}

// Gemini APIを初期化
function initializeGemini(apiKey) {
    try {
        // グローバルスコープから GoogleGenerativeAI を取得
        const { GoogleGenerativeAI } = window;

        if (!GoogleGenerativeAI) {
            throw new Error('GoogleGenerativeAI が読み込まれていません');
        }

        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        console.log('Gemini API initialized successfully');
    } catch (error) {
        console.error('Gemini API initialization error:', error);
        alert(`Gemini API初期化エラー: ${error.message}`);
    }
}

// 新しいチャットセッションを開始
function startNewChatSession() {
    if (!model) {
        console.error('Model not initialized');
        return;
    }

    chatSession = model.startChat({
        generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
        history: [
            {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT }],
            },
            {
                role: "model",
                parts: [{ text: "理解しました。私は2人の経済学者（ポール・クルーグマンとスティーヴン・レヴィット）の視点を統合したAIアシスタントとして、経済政策に関する質問に答えます。理論的な説明と実践的なデータ、そして意図しない結果についても考慮しながら、簡潔に回答します。" }],
            },
        ],
    });
}

// チャットメッセージを追加
function addChatMessage(type, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);

    // 自動スクロール
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// メッセージを送信
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const message = input.value.trim();

    if (!message) {
        return;
    }

    if (!chatSession) {
        addChatMessage('system', 'エラー: チャットセッションが初期化されていません');
        return;
    }

    // ユーザーメッセージを表示
    addChatMessage('user', message);
    input.value = '';

    // 送信ボタンを無効化
    sendBtn.disabled = true;
    sendBtn.textContent = '送信中...';

    try {
        // 現在の経済指標を取得（app.jsのeconomicStateを使用）
        let economicContext = '';
        if (typeof economicState !== 'undefined') {
            economicContext = `\n\n[経済指標]\nGDP成長率: ${economicState.gdpGrowth.toFixed(1)}%\nインフレ率: ${economicState.inflation.toFixed(1)}%\n失業率: ${economicState.unemployment.toFixed(1)}%\n金利: ${economicState.interestRate.toFixed(1)}%\n為替レート: ${economicState.exchangeRate.toFixed(0)}\n貿易収支: ${economicState.tradeBalance}億\n政府支出: ${economicState.governmentSpending}億\n関税率: ${economicState.tariffRate.toFixed(1)}%\n現在のターン: ${currentTurn}`;
        }

        // Gemini APIにメッセージを送信
        const result = await chatSession.sendMessage(message + economicContext);
        const response = await result.response;
        const text = response.text();

        // AIの応答を表示
        addChatMessage('ai', text);
    } catch (error) {
        console.error('Gemini API error:', error);
        let errorMessage = 'エラーが発生しました';

        if (error.message.includes('API key')) {
            errorMessage = 'APIキーが無効です。API設定を確認してください。';
        } else if (error.message.includes('quota')) {
            errorMessage = 'APIの使用量制限に達しました。しばらく待ってから再試行してください。';
        } else if (error.message.includes('not found')) {
            errorMessage = `モデル "${GEMINI_MODEL}" が見つかりません。`;
        } else {
            errorMessage = `エラー: ${error.message}`;
        }

        addChatMessage('system', errorMessage);
    } finally {
        // 送信ボタンを再有効化
        sendBtn.disabled = false;
        sendBtn.textContent = '送信';
    }
}

// Enterキーで送信
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // モーダルの外側をクリックで閉じる
    window.addEventListener('click', (event) => {
        const apiModal = document.getElementById('api-settings-modal');
        const chatModal = document.getElementById('ai-chat-modal');

        if (event.target === apiModal) {
            closeApiSettings();
        }
        if (event.target === chatModal) {
            closeAiChat();
        }
    });

    // 起動時にAPIキーがあれば自動初期化
    const savedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (savedKey) {
        initializeGemini(savedKey);
    }
});
