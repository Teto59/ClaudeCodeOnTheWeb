/**
 * Gemini AI経済アドバイザーシステム
 * 2025年版 - 新SDK (@google/genai) 使用
 *
 * 使用パッケージ: @google/genai (2025年以降の公式SDK)
 * 旧パッケージ: @google/generative-ai (2025年11月30日サポート終了)
 *
 * Google公式ドキュメント:
 * https://ai.google.dev/gemini-api/docs
 */

// ==================== 定数 ====================
const CONFIG = {
    DEFAULT_MODEL: 'gemini-2.5-flash',  // デフォルトは高速版（レート制限緩い）
    STORAGE_KEY_API: 'gemini_api_key',
    STORAGE_KEY_MODEL: 'gemini_model_name',
    AVAILABLE_MODELS: {
        'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', description: '高速・レート制限緩い' },
        'gemini-2.5-pro': { name: 'Gemini 2.5 Pro', description: '高品質・レート制限厳しい' }
    },
    SYSTEM_PROMPT: `あなたは2人の著名な経済学者の知見を統合したAIアシスタントです：

【ポール・クルーグマン】
- 国際貿易、マクロ経済学の専門家
- 理論的アプローチ（IS-LMモデル、マンデル=フレミング・モデル、フィリップス曲線など）
- 歴史的事例の引用（プラザ合意、欧州債務危機、リーマンショックなど）
- やや辛口で現実主義的、グローバルな視点
- ケインジアン経済学の支持者

【スティーヴン・レヴィット】
- 行動経済学、データ分析の専門家
- インセンティブと意図しない結果に注目
- 具体的なデータと統計を引用（「60%増加」など）
- 比喩表現を多用（「ダイエット」「ドーピング」など）
- 皮肉的で意外性を重視、因果関係の専門家

【回答方針】
1. 両方の視点から経済政策を分析
2. 理論とデータの両面から説明
3. 歴史的事例や具体例を引用
4. 短期的影響と長期的影響を区別
5. 意図しない結果やトレードオフにも言及
6. 日本語で専門用語も分かりやすく説明

【回答形式】
- クルーグマンの視点（理論的・グローバル）
- レヴィットの視点（データ・インセンティブ）
- 総合的な推奨事項
`
};

// ==================== 状態管理 ====================
const State = {
    ai: null,  // GoogleGenAI インスタンス
    isInitialized: false,
    isProcessing: false,
    chatHistory: []
};

// ==================== Model管理 ====================
const ModelManager = {
    get() {
        return localStorage.getItem(CONFIG.STORAGE_KEY_MODEL) || CONFIG.DEFAULT_MODEL;
    },

    set(modelName) {
        if (CONFIG.AVAILABLE_MODELS[modelName]) {
            localStorage.setItem(CONFIG.STORAGE_KEY_MODEL, modelName);
        }
    },

    getCurrentModel() {
        return this.get();
    },

    getModelInfo(modelName) {
        return CONFIG.AVAILABLE_MODELS[modelName] || null;
    }
};

// ==================== API Key管理 ====================
const ApiKeyManager = {
    get() {
        return localStorage.getItem(CONFIG.STORAGE_KEY_API);
    },

    set(key) {
        localStorage.setItem(CONFIG.STORAGE_KEY_API, key);
    },

    remove() {
        localStorage.removeItem(CONFIG.STORAGE_KEY_API);
        State.ai = null;
        State.isInitialized = false;
    },

    validate(key) {
        if (!key || typeof key !== 'string') {
            return { valid: false, error: 'APIキーが入力されていません' };
        }

        if (!key.startsWith('AIza')) {
            return { valid: false, error: 'APIキーの形式が正しくありません（AIzaで始まる必要があります）' };
        }

        if (key.length < 30) {
            return { valid: false, error: 'APIキーが短すぎます' };
        }

        return { valid: true };
    }
};

// ==================== Gemini初期化 ====================
const GeminiAPI = {
    // ライブラリのロードを待つ
    async waitForLibrary(maxWait = 5000) {
        const startTime = Date.now();
        while (typeof GoogleGenAI === 'undefined') {
            if (Date.now() - startTime > maxWait) {
                throw new Error('Gemini APIライブラリの読み込みがタイムアウトしました');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('✅ GoogleGenAI is ready');
    },

    async initialize(apiKey) {
        try {
            // GoogleGenAIがロードされるまで待つ
            await this.waitForLibrary();

            if (typeof GoogleGenAI === 'undefined') {
                throw new Error('Gemini APIライブラリが読み込まれていません');
            }

            // 新しいSDKの書き方（Google公式）
            State.ai = new GoogleGenAI({
                apiKey: apiKey
            });

            State.isInitialized = true;
            const currentModel = ModelManager.getCurrentModel();
            console.log(`✅ Gemini initialized successfully`);
            console.log(`📦 Model: ${currentModel}`);
            console.log(`🆕 Using new SDK: @google/genai`);

            return { success: true };

        } catch (error) {
            console.error('❌ Gemini initialization failed:', error);
            State.ai = null;
            State.isInitialized = false;

            return {
                success: false,
                error: error.message || 'API初期化に失敗しました'
            };
        }
    },

    async sendMessage(userMessage) {
        if (!State.ai || !State.isInitialized) {
            throw new Error('Gemini APIが初期化されていません');
        }

        if (State.isProcessing) {
            throw new Error('処理中です。しばらくお待ちください');
        }

        State.isProcessing = true;

        try {
            // 経済状態を取得
            const economicContext = EconomicStateHelper.getContext();

            // プロンプトを構築
            const fullPrompt = `${CONFIG.SYSTEM_PROMPT}\n\n${economicContext}\n\nユーザーの質問: ${userMessage}`;

            // 新しいSDKの書き方（Google公式）
            const currentModel = ModelManager.getCurrentModel();
            const response = await State.ai.models.generateContent({
                model: currentModel,
                contents: fullPrompt
            });

            const text = response.text;

            // 履歴に追加
            State.chatHistory.push(
                { role: 'user', content: userMessage },
                { role: 'ai', content: text }
            );

            return { success: true, text };

        } catch (error) {
            console.error('❌ Message send failed:', error);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });

            // エラーの種類に応じたメッセージ
            let errorMessage = 'エラーが発生しました';

            if (error.message?.includes('API key') || error.message?.includes('API_KEY_INVALID')) {
                errorMessage = 'APIキーが無効です。設定を確認してください';
                ApiKeyManager.remove();
            } else if (error.message?.includes('503') || error.message?.includes('overloaded') || error.message?.includes('UNAVAILABLE')) {
                errorMessage = 'レートリミットに達しました。しばらく待ってから再度試行してください。';
            } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('RESOURCE_EXHAUSTED')) {
                errorMessage = 'API使用量制限に達しました。しばらく待ってから再試行してください';
            } else if (error.message?.includes('model not found') || error.message?.includes('models/') || error.message?.includes('404')) {
                const currentModel = ModelManager.getCurrentModel();
                errorMessage = `モデル "${currentModel}" の呼び出しに失敗しました。\n\nエラー詳細: ${error.message}`;
                console.error('🔍 使用中のモデル:', currentModel);
                console.error('💡 利用可能なモデル: gemini-2.5-pro, gemini-2.5-flash');
            } else if (error.message) {
                errorMessage = error.message;
            }

            return { success: false, error: errorMessage };

        } finally {
            State.isProcessing = false;
        }
    }
};

// ==================== 経済状態ヘルパー ====================
const EconomicStateHelper = {
    getContext() {
        // app.jsのeconomicStateとcurrentTurnを参照
        if (typeof economicState !== 'undefined' && typeof currentTurn !== 'undefined') {
            return `【現在の経済状態（ターン${currentTurn}）】
- GDP成長率: ${economicState.gdpGrowth.toFixed(1)}%
- インフレ率: ${economicState.inflation.toFixed(1)}%
- 失業率: ${economicState.unemployment.toFixed(1)}%
- 金利: ${economicState.interestRate.toFixed(1)}%
- 為替レート: ${economicState.exchangeRate.toFixed(0)} (対ドル)
- 貿易収支: ${economicState.tradeBalance.toFixed(0)}億
- 政府支出: ${economicState.governmentSpending.toFixed(0)}億
- 関税率: ${economicState.tariffRate.toFixed(1)}%

※この経済状態を考慮してアドバイスしてください`;
        }
        return '';
    }
};

// ==================== UI管理 ====================
const UI = {
    // モーダル管理
    Modal: {
        open(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        },

        close(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        }
    },

    // チャット管理
    Chat: {
        clear() {
            const container = document.getElementById('chat-container');
            if (container) {
                container.innerHTML = '';
                State.chatHistory = [];
            }
        },

        addMessage(type, content) {
            const container = document.getElementById('chat-container');
            if (!container) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${type}`;

            // 簡易的なMarkdown変換
            const formatted = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            messageDiv.innerHTML = `<p>${formatted}</p>`;
            container.appendChild(messageDiv);

            // 自動スクロール
            container.scrollTop = container.scrollHeight;

            return messageDiv;
        },

        showLoading() {
            const container = document.getElementById('chat-container');
            if (!container) return null;

            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'chat-message loading';
            loadingDiv.id = 'loading-message';
            loadingDiv.innerHTML = '<p>💭 考え中...</p>';
            container.appendChild(loadingDiv);
            container.scrollTop = container.scrollHeight;

            return loadingDiv;
        },

        removeLoading() {
            const loading = document.getElementById('loading-message');
            if (loading) {
                loading.remove();
            }
        }
    },

    // 入力管理
    Input: {
        getValue(inputId) {
            const input = document.getElementById(inputId);
            return input ? input.value.trim() : '';
        },

        setValue(inputId, value) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = value;
            }
        },

        clear(inputId) {
            this.setValue(inputId, '');
        },

        setDisabled(selector, disabled) {
            const element = document.querySelector(selector);
            if (element) {
                element.disabled = disabled;
            }
        }
    }
};

// ==================== イベントハンドラ ====================

/**
 * API設定モーダルを開く
 */
window.openApiKeyModal = function() {
    UI.Modal.open('api-key-modal');

    // 既存のキーがあれば表示
    const existingKey = ApiKeyManager.get();
    if (existingKey) {
        UI.Input.setValue('api-key-input', existingKey);
    }

    // 既存のモデル選択を表示
    const currentModel = ModelManager.getCurrentModel();
    UI.Input.setValue('model-select', currentModel);
};

/**
 * API設定モーダルを閉じる
 */
window.closeApiKeyModal = function() {
    UI.Modal.close('api-key-modal');
    UI.Input.clear('api-key-input');
};

/**
 * APIキーを保存
 */
window.saveApiKey = async function() {
    const apiKey = UI.Input.getValue('api-key-input');
    const selectedModel = UI.Input.getValue('model-select');

    // バリデーション
    const validation = ApiKeyManager.validate(apiKey);
    if (!validation.valid) {
        alert(`❌ ${validation.error}`);
        return;
    }

    // 保存
    ApiKeyManager.set(apiKey);
    ModelManager.set(selectedModel);

    // 初期化
    const result = await GeminiAPI.initialize(apiKey);

    if (result.success) {
        // 成功時
        UI.Input.clear('api-key-input');
        UI.Modal.close('api-key-modal');

        // チャットをクリアして開く
        UI.Chat.clear();
        setTimeout(() => {
            window.openGeminiChat();
        }, 200);

    } else {
        // 失敗時
        alert(`❌ ${result.error}`);
        ApiKeyManager.remove();
    }
};

/**
 * Geminiチャットモーダルを開く
 */
window.openGeminiChat = function() {
    const apiKey = ApiKeyManager.get();

    // APIキー未設定の場合
    if (!apiKey) {
        alert('⚠️ 先にAPIキーを設定してください');
        window.openApiKeyModal();
        return;
    }

    // 初期化されていない場合は初期化
    if (!State.isInitialized) {
        GeminiAPI.initialize(apiKey).then(result => {
            if (result.success) {
                openChatModalWithWelcome();
            } else {
                alert(`❌ ${result.error}\n\nAPIキーを再設定してください`);
                ApiKeyManager.remove();
                window.openApiKeyModal();
            }
        });
    } else {
        openChatModalWithWelcome();
    }
};

/**
 * チャットモーダルを開く（ウェルカムメッセージ付き）
 */
function openChatModalWithWelcome() {
    UI.Modal.open('gemini-modal');

    // 初回のみウェルカムメッセージ
    if (State.chatHistory.length === 0) {
        UI.Chat.addMessage('ai', 'こんにちは！経済政策について質問してください。\n\n🌍 **クルーグマン**と💡 **レヴィット**の視点から分析します。\n\n現在の経済状態を考慮した具体的なアドバイスを提供できます。');
    }
}

/**
 * Geminiチャットモーダルを閉じる
 */
window.closeGeminiChat = function() {
    UI.Modal.close('gemini-modal');
};

/**
 * メッセージを送信
 */
window.sendMessage = async function() {
    const message = UI.Input.getValue('chat-input');

    if (!message) {
        return;
    }

    // ユーザーメッセージを表示
    UI.Chat.addMessage('user', message);
    UI.Input.clear('chat-input');

    // 送信ボタンを無効化
    UI.Input.setDisabled('.send-btn', true);

    // ローディング表示
    UI.Chat.showLoading();

    // API呼び出し
    const result = await GeminiAPI.sendMessage(message);

    // ローディング削除
    UI.Chat.removeLoading();

    // 結果を表示
    if (result.success) {
        UI.Chat.addMessage('ai', result.text);
    } else {
        UI.Chat.addMessage('ai', `⚠️ ${result.error}`);
    }

    // 送信ボタンを有効化
    UI.Input.setDisabled('.send-btn', false);
};

/**
 * Enterキーで送信
 */
window.handleChatKeypress = function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        window.sendMessage();
    }
};

// ==================== 初期化 ====================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Gemini Chat System initialized (New SDK)');

    // モーダル外クリックで閉じる
    document.addEventListener('click', function(event) {
        if (event.target.id === 'gemini-modal') {
            window.closeGeminiChat();
        }
        if (event.target.id === 'api-key-modal') {
            window.closeApiKeyModal();
        }
    });

    // 保存されたAPIキーで自動初期化
    const apiKey = ApiKeyManager.get();
    if (apiKey) {
        const result = await GeminiAPI.initialize(apiKey);
        if (result.success) {
            console.log('✅ Auto-initialized with saved API key');
        } else {
            console.warn('⚠️ Failed to auto-initialize, key may be invalid');
            ApiKeyManager.remove();
        }
    }
});
