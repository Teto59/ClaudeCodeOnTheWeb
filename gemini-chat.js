// Geminiチャット機能（ES Modulesなし、グローバルスコープ版）

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
let geminiModel = null;
let hasShownWelcome = false;

// API Key管理
function getApiKey() {
    return localStorage.getItem('gemini_api_key');
}

function saveApiKey(key) {
    localStorage.setItem('gemini_api_key', key);
}

function deleteApiKey() {
    localStorage.removeItem('gemini_api_key');
    geminiModel = null;
}

// Gemini初期化
function initGemini(apiKey) {
    try {
        // GoogleGenerativeAIがグローバルに読み込まれているか確認
        if (typeof GoogleGenerativeAI === 'undefined') {
            console.error('GoogleGenerativeAI is not loaded');
            return false;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log('Gemini initialized successfully');
        return true;
    } catch (error) {
        console.error('Gemini initialization failed:', error);
        return false;
    }
}

// 「Geminiに質問する」ボタンのクリックハンドラ
window.openGeminiChat = function() {
    const apiKey = getApiKey();

    if (!apiKey) {
        // API Key未設定の場合は設定モーダルを開く
        openApiKeyModal();
    } else {
        // API Key設定済みの場合はチャットモーダルを開く
        if (!geminiModel) {
            // 初期化されていない場合は初期化
            if (initGemini(apiKey)) {
                openChatModal();
            } else {
                alert('Gemini APIの初期化に失敗しました。API Keyを再設定してください。');
                deleteApiKey();
                openApiKeyModal();
            }
        } else {
            openChatModal();
        }
    }
};

// チャットモーダルを開く
function openChatModal() {
    const modal = document.getElementById('gemini-modal');
    modal.classList.add('active');

    // 初回のみウェルカムメッセージを表示
    if (!hasShownWelcome) {
        clearChat();
        addMessage('ai', 'こんにちは！経済政策について質問してください。クルーグマンとレヴィットの視点から分析します。\n\n現在の経済状態を考慮したアドバイスを提供できます。');
        hasShownWelcome = true;
    }
}

// チャットモーダルを閉じる
window.closeGeminiChat = function() {
    const modal = document.getElementById('gemini-modal');
    modal.classList.remove('active');
};

// API Key設定モーダルを開く
function openApiKeyModal() {
    const modal = document.getElementById('api-key-modal');
    modal.classList.add('active');
}

// API Key設定モーダルを閉じる
window.closeApiKeyModal = function() {
    const modal = document.getElementById('api-key-modal');
    modal.classList.remove('active');
};

// API Key保存
window.saveApiKey = function() {
    const input = document.getElementById('api-key-input');
    const apiKey = input.value.trim();

    if (!apiKey) {
        alert('API Keyを入力してください。');
        return;
    }

    if (!apiKey.startsWith('AIza')) {
        alert('無効なAPI Keyです。正しいAPI Keyを入力してください。\n(API Keyは"AIza"で始まります)');
        return;
    }

    // API Keyを保存
    saveApiKey(apiKey);

    // Geminiを初期化
    if (initGemini(apiKey)) {
        input.value = '';
        closeApiKeyModal();

        // チャットをクリアしてモーダルを開く
        clearChat();
        hasShownWelcome = false;

        setTimeout(() => {
            openChatModal();
        }, 200);
    } else {
        alert('API Keyの初期化に失敗しました。正しいAPI Keyを入力してください。');
        deleteApiKey();
    }
};

// チャットをクリア
function clearChat() {
    const container = document.getElementById('chat-container');
    if (container) {
        container.innerHTML = '';
    }
}

// メッセージを追加
function addMessage(type, text) {
    const container = document.getElementById('chat-container');
    if (!container) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    // 簡易的なMarkdown変換
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    messageDiv.innerHTML = `<p>${formatted}</p>`;
    container.appendChild(messageDiv);

    // 自動スクロール
    container.scrollTop = container.scrollHeight;

    return messageDiv;
}

// ローディング表示
function showLoading() {
    const container = document.getElementById('chat-container');
    if (!container) return null;

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message loading';
    loadingDiv.innerHTML = '<p>💭 考え中...</p>';
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    return loadingDiv;
}

// 経済状態を取得
function getEconomicState() {
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

    if (!message) return;

    // ユーザーメッセージを表示
    addMessage('user', message);
    input.value = '';

    // 送信ボタンを無効化
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) sendBtn.disabled = true;

    // ローディング表示
    const loading = showLoading();

    try {
        // モデルの確認
        if (!geminiModel) {
            throw new Error('Gemini APIが初期化されていません。');
        }

        // プロンプト構築
        const economicState = getEconomicState();
        const prompt = `${SYSTEM_PROMPT}\n\n${economicState}\n\nユーザーの質問: ${message}`;

        // API呼び出し
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // ローディング削除
        if (loading) loading.remove();

        // AIの回答を表示
        addMessage('ai', text);

    } catch (error) {
        console.error('Error:', error);

        // ローディング削除
        if (loading) loading.remove();

        // エラーメッセージ
        let errorMsg = '⚠️ エラーが発生しました。';

        if (error.message.includes('API') || error.message.includes('key')) {
            errorMsg = '⚠️ API Keyが無効です。設定を確認してください。';
            deleteApiKey();
        } else if (error.message.includes('quota')) {
            errorMsg = '⚠️ API利用制限に達しました。しばらく待ってから再試行してください。';
        } else {
            errorMsg = `⚠️ エラー: ${error.message}`;
        }

        addMessage('ai', errorMsg);
    } finally {
        // 送信ボタンを有効化
        if (sendBtn) sendBtn.disabled = false;
    }
};

// Enterキーで送信
window.handleChatKeypress = function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
};

// モーダル外クリックで閉じる
document.addEventListener('click', function(event) {
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
    console.log('Gemini Chat initialized');

    // 保存されたAPI Keyで初期化
    const apiKey = getApiKey();
    if (apiKey) {
        initGemini(apiKey);
    }
});
