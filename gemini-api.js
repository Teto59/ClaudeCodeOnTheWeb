// Gemini API クライアント

class GeminiAPIClient {
    constructor() {
        this.apiKey = this.loadAPIKey();
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    // LocalStorageからAPI Keyを読み込む
    loadAPIKey() {
        return localStorage.getItem('gemini_api_key') || '';
    }

    // LocalStorageにAPI Keyを保存
    saveAPIKey(apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
        this.apiKey = apiKey;
    }

    // API Keyを削除
    clearAPIKey() {
        localStorage.removeItem('gemini_api_key');
        this.apiKey = '';
    }

    // API Keyが設定されているかチェック
    hasAPIKey() {
        return this.apiKey && this.apiKey.length > 0;
    }

    // Gemini APIに経済政策分析をリクエスト
    async analyzePolicyRecommendation(economicState) {
        if (!this.hasAPIKey()) {
            throw new Error('API Keyが設定されていません。設定ボタンからAPI Keyを入力してください。');
        }

        const prompt = this.buildPrompt(economicState);

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        };

        try {
            const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                if (response.status === 400) {
                    const errorData = await response.json();
                    throw new Error('API Keyが無効です。正しいAPI Keyを設定してください。');
                }
                throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('APIからの応答が空です。');
            }

            const text = data.candidates[0].content.parts[0].text;
            return text;

        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('ネットワークエラー: インターネット接続を確認してください。');
            }
            throw error;
        }
    }

    // プロンプトを構築
    buildPrompt(economicState) {
        return `あなたは経済政策の専門家です。以下の経済状況を分析し、科学的・経済学的に妥当な政策を提案してください。

## 現在の経済指標

- **GDP成長率**: ${economicState.gdpGrowth.toFixed(1)}%
- **インフレ率**: ${economicState.inflation.toFixed(1)}%
- **失業率**: ${economicState.unemployment.toFixed(1)}%
- **金利**: ${economicState.interestRate.toFixed(1)}%
- **為替レート**: ${economicState.exchangeRate.toFixed(0)} (対ドル)
- **貿易収支**: ${economicState.tradeBalance.toFixed(0)}億
- **政府支出**: ${economicState.governmentSpending.toFixed(0)}億
- **関税率**: ${economicState.tariffRate.toFixed(1)}%

## 分析の観点

1. **経済状況の評価**: 現在の経済状況をマクロ経済学的に評価してください
2. **問題点の特定**: 主な問題点（インフレ、デフレ、失業、貿易赤字など）を特定してください
3. **政策提案**: 以下の4つの政策カテゴリから、科学的・経済学的に妥当な政策を具体的に提案してください
   - 金融政策（金利の調整）
   - 財政政策（政府支出の調整）
   - 貿易政策（関税の調整）
   - 為替政策（為替介入）
4. **根拠**: 提案する政策の経済学的根拠と予想される効果を説明してください
5. **リスク**: 政策のリスクや副作用についても言及してください

回答は日本語で、分かりやすく、具体的にお願いします。`;
    }
}

// グローバルにインスタンスを作成
const geminiClient = new GeminiAPIClient();
