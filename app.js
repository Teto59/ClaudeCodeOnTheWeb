// 経済指標の状態管理
let economicState = {
    gdpGrowth: 2.5,        // GDP成長率（%）
    inflation: 2.0,        // インフレ率（%）
    unemployment: 5.0,     // 失業率（%）
    interestRate: 3.0,     // 金利（%）
    exchangeRate: 100,     // 為替レート（対ドル）
    tradeBalance: 0,       // 貿易収支（億）
    governmentSpending: 1000,  // 政府支出（億）
    tariffRate: 5.0        // 関税率（%）
};

// 履歴データ（グラフ用）
let history = {
    gdpGrowth: [2.5],
    inflation: [2.0],
    unemployment: [5.0],
    interestRate: [3.0],
    exchangeRate: [100],
    tradeBalance: [0]
};

let currentTurn = 1;
let chart = null;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    initChart();
    updateAPIKeyStatus();
});

// 表示の更新
function updateDisplay() {
    document.getElementById('gdp-value').textContent = economicState.gdpGrowth.toFixed(1) + '%';
    document.getElementById('inflation-value').textContent = economicState.inflation.toFixed(1) + '%';
    document.getElementById('unemployment-value').textContent = economicState.unemployment.toFixed(1) + '%';
    document.getElementById('interest-value').textContent = economicState.interestRate.toFixed(1) + '%';
    document.getElementById('exchange-value').textContent = economicState.exchangeRate.toFixed(0);
    document.getElementById('trade-value').textContent = economicState.tradeBalance.toFixed(0) + '億';
    document.getElementById('spending-value').textContent = economicState.governmentSpending.toFixed(0) + '億';
    document.getElementById('tariff-value').textContent = economicState.tariffRate.toFixed(1) + '%';
    document.getElementById('current-turn').textContent = currentTurn;
}

// Chart.jsの初期化
function initChart() {
    const ctx = document.getElementById('economicChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: history.gdpGrowth.length}, (_, i) => `ターン${i + 1}`),
            datasets: [
                {
                    label: 'GDP成長率 (%)',
                    data: history.gdpGrowth,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'インフレ率 (%)',
                    data: history.inflation,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                },
                {
                    label: '失業率 (%)',
                    data: history.unemployment,
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    tension: 0.1
                },
                {
                    label: '金利 (%)',
                    data: history.interestRate,
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '経済指標の推移'
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// グラフの更新
function updateChart() {
    chart.data.labels.push(`ターン${currentTurn}`);
    chart.data.datasets[0].data.push(economicState.gdpGrowth);
    chart.data.datasets[1].data.push(economicState.inflation);
    chart.data.datasets[2].data.push(economicState.unemployment);
    chart.data.datasets[3].data.push(economicState.interestRate);
    chart.update();
}

// 経済学者の解説を更新（2人）
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

// 次のターンへ進む
function nextTurn() {
    currentTurn++;
    history.gdpGrowth.push(economicState.gdpGrowth);
    history.inflation.push(economicState.inflation);
    history.unemployment.push(economicState.unemployment);
    history.interestRate.push(economicState.interestRate);
    history.exchangeRate.push(economicState.exchangeRate);
    history.tradeBalance.push(economicState.tradeBalance);
}

// 金利調整
function adjustInterestRate(change) {
    economicState.interestRate += change;
    economicState.interestRate = Math.max(0, Math.min(20, economicState.interestRate));

    let krugmanComment = '';
    let levittComment = '';

    if (change > 0) {
        // 金利上昇
        economicState.gdpGrowth -= 0.3;
        economicState.inflation -= 0.4;
        economicState.unemployment += 0.2;
        economicState.exchangeRate -= 3; // 通貨高

        krugmanComment = `
            <p><strong>金融引き締めだ。</strong>短期的には投資が冷え込み、経済成長は鈍化する。</p>
            <p>しかし、インフレを抑制し、通貨は強くなる。為替レートの上昇は輸出産業には痛手だが、輸入品は安くなる。</p>
            <p>国際経済学の基本、<strong>マンデル=フレミング・モデル</strong>そのものだ。資本移動が自由な経済では、金利上昇は必然的に通貨高を招く。</p>
        `;

        levittComment = `
            <p>面白いことに、金利が上がると企業はどう動くか？データを見ると、<strong>投資を先送りにする企業が60%増える</strong>。</p>
            <p>また、消費者は大きな買い物（住宅、自動車）を控える。インセンティブが変わると、人々の行動も変わる。</p>
            <p>しかし、政府の意図通りにはいかないことも多い。例えば、住宅ローンを抱えた家庭の消費は想定以上に落ち込む傾向がある。</p>
        `;
    } else {
        // 金利低下
        economicState.gdpGrowth += 0.4;
        economicState.inflation += 0.3;
        economicState.unemployment -= 0.2;
        economicState.exchangeRate += 3; // 通貨安

        krugmanComment = `
            <p><strong>金融緩和政策だ。</strong>借入コストが低下し、企業の投資が促進される。</p>
            <p>消費が増加し、物価が上昇する。経済活動が活発化し、失業率が低下する。</p>
            <p>ただし、やりすぎると資産バブルのリスクがある。<strong>2008年の金融危機</strong>は、まさにこの政策の行き過ぎが一因だった。</p>
        `;

        levittComment = `
            <p>金利が下がると、人々はどう行動するか？データによると、<strong>住宅ローンの申請が40%増加</strong>する。</p>
            <p>また、企業は設備投資を加速させる。しかし、意外なことに、一部の消費者は「何かおかしい」と警戒し、逆に貯蓄を増やすこともある。</p>
            <p>経済学では「合理的期待」と呼ばれるが、実際の人間の行動はもっと複雑だ。</p>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment);
}

// 政府支出調整
function adjustGovernmentSpending(change) {
    economicState.governmentSpending += change;
    economicState.governmentSpending = Math.max(0, economicState.governmentSpending);

    let krugmanComment = '';
    let levittComment = '';

    if (change > 0) {
        // 支出増加
        economicState.gdpGrowth += 0.5;
        economicState.inflation += 0.3;
        economicState.unemployment -= 0.3;

        krugmanComment = `
            <p><strong>典型的なケインジアン政策だ。</strong>需要が不足している時には効果的。</p>
            <p>政府支出は<strong>乗数効果</strong>で経済を刺激し、失業率を下げる。1ドルの政府支出が、最終的に1.5～2ドルのGDP増加をもたらす。</p>
            <p>ただし、インフレリスクには注意が必要だ。財源をどうするかも重要な問題だ。増税か国債発行か、選択を間違えると効果が半減する。</p>
        `;

        levittComment = `
            <p>政府支出が増えると、誰が得をする？データによると、<strong>支出の30%は非効率に使われる傾向がある</strong>。</p>
            <p>また、企業は政府契約を得ようとロビー活動を増やす。意図しない結果として、民間投資がクラウドアウトされることもある。</p>
            <p>「ヤクザでさえ経済的インセンティブに従う」と私は書いたが、政府も例外ではない。予算が増えれば、無駄遣いのインセンティブも増える。</p>
        `;
    } else {
        // 支出減少
        economicState.gdpGrowth -= 0.4;
        economicState.inflation -= 0.2;
        economicState.unemployment += 0.3;

        krugmanComment = `
            <p><strong>財政緊縮政策だ。</strong>需要が不足している時にこれを行うと、経済はさらに悪化する。</p>
            <p>公共投資や社会保障が縮小し、総需要が減少する。失業率が上昇し、経済は螺旋的に悪化する可能性がある。</p>
            <p><strong>欧州債務危機</strong>の時、多くの国が緊縮財政で経済を悪化させた。財政健全化は重要だが、タイミングを間違えると逆効果だ。</p>
        `;

        levittComment = `
            <p>政府支出が減ると、何が起こるか？データによると、<strong>公務員の労働意欲が15%低下</strong>する傾向がある。</p>
            <p>また、民間企業は政府契約の減少を見越して、雇用を減らす。意外なことに、一部の企業は政府支出減少を「規制緩和のシグナル」と受け取り、投資を増やすこともある。</p>
            <p>インセンティブは複雑だ。政府が「財政規律」を示すと、民間の信頼が回復する場合もある。</p>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment);
}

// 関税調整
function adjustTariff(change) {
    economicState.tariffRate += change;
    economicState.tariffRate = Math.max(0, Math.min(50, economicState.tariffRate));

    let krugmanComment = '';
    let levittComment = '';

    if (change > 0) {
        // 関税引き上げ
        economicState.tradeBalance += 50;
        economicState.inflation += 0.2;
        economicState.gdpGrowth -= 0.2;

        krugmanComment = `
            <p><strong>保護主義は両国を貧しくする</strong>、というのがリカードの時代からの教訓だ。</p>
            <p>短期的には国内産業を守れるように見えるが、相手国も報復関税をかけてくる。結果は貿易戦争だ。</p>
            <p>消費者は高い価格を払い、<strong>比較優位</strong>の利益を失う。1930年代の<strong>スムート・ホーリー関税法</strong>は世界恐慌を深刻化させた。歴史は繰り返す。</p>
        `;

        levittComment = `
            <p>関税を上げると企業は創造的になる。<strong>原産地表示を操作</strong>したり、第三国経由で輸入したり。</p>
            <p>また、密輸が20%増加するデータもある。インセンティブ設計の失敗例として、私の著書に書きたいケースだ。</p>
            <p>意外なことに、関税で守られた産業は競争力を失い、長期的には衰退する。保護主義は、まるで麻薬のようなものだ。</p>
        `;
    } else {
        // 関税引き下げ
        economicState.tradeBalance -= 50;
        economicState.inflation -= 0.1;
        economicState.gdpGrowth += 0.3;

        krugmanComment = `
            <p><strong>自由貿易の推進だ。</strong>輸入品が安くなり、消費者の選択肢が拡大する。</p>
            <p>貿易収支は悪化するが、それは必ずしも問題ではない。重要なのは、経済全体の効率性が向上することだ。</p>
            <p><strong>比較優位</strong>に基づく国際分業は、両国を豊かにする。中国の台頭は、まさにこの原理の実証例だ。</p>
        `;

        levittComment = `
            <p>関税が下がると、消費者はどう行動するか？データによると、<strong>輸入品の購入が35%増加</strong>する。</p>
            <p>また、国内企業は海外との競争にさらされ、効率化を迫られる。意外なことに、一部の企業は競争により革新的になり、むしろ成長する。</p>
            <p>「相撲取りはインセンティブに従う」と私は書いたが、企業も同じだ。ぬるま湯に浸かった企業は、競争がないと成長しない。</p>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment);
}

// 為替介入
function adjustExchangeRate(change) {
    economicState.exchangeRate += change;
    economicState.exchangeRate = Math.max(50, Math.min(200, economicState.exchangeRate));

    let krugmanComment = '';
    let levittComment = '';

    if (change < 0) {
        // 自国通貨買い（通貨高）
        economicState.inflation -= 0.3;
        economicState.tradeBalance -= 80;
        economicState.gdpGrowth -= 0.2;

        krugmanComment = `
            <p><strong>通貨高政策だ。</strong>通貨が強くなり輸入品が安くなる。インフレ率は低下する。</p>
            <p>しかし、輸出品が高くなり競争力が低下する。輸出産業に打撃を与え、貿易収支が悪化する。</p>
            <p><strong>プラザ合意</strong>後の日本がまさにこれだった。円高で輸出産業は苦しんだが、結果的に産業構造の転換を促した。短期的な痛みが長期的な利益になることもある。</p>
        `;

        levittComment = `
            <p>通貨が高くなると、輸出企業はどう動くか？データによると、<strong>海外への工場移転が25%増加</strong>する。</p>
            <p>また、消費者は輸入品を買うようになり、国内産業は打撃を受ける。意外なことに、一部の輸出企業は高付加価値製品にシフトし、むしろ収益を伸ばす。</p>
            <p>インセンティブが変わると、企業も変わる。通貨高は、まるで「ダイエット」のようなものだ。つらいが、健康にはいい。</p>
        `;
    } else {
        // 自国通貨売り（通貨安）
        economicState.inflation += 0.3;
        economicState.tradeBalance += 80;
        economicState.gdpGrowth += 0.3;

        krugmanComment = `
            <p><strong>通貨安政策だ。</strong>通貨が弱くなり輸出品が安くなる。貿易収支が改善し、GDP成長率が上昇する。</p>
            <p>しかし、輸入品が高くなり、インフレ率が上昇する。消費者の購買力が低下する。</p>
            <p><strong>中国の人民元安政策</strong>がこれだった。輸出主導で経済成長を遂げたが、輸入物価高で国民の生活は苦しかった。「近隣窮乏化政策」と批判されることもある。</p>
        `;

        levittComment = `
            <p>通貨が安くなると、輸出企業はどう動くか？データによると、<strong>輸出量が30%増加</strong>する。</p>
            <p>また、観光客が増える。意外なことに、国内企業は「輸入品との競争が緩和された」と安心し、効率化を怠ることもある。</p>
            <p>通貨安は、まるで「ドーピング」のようなものだ。短期的には効果があるが、長期的には依存症になる。競争力の本質的な向上にはならない。</p>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment);
}

// シミュレーションのリセット
function resetSimulation() {
    if (confirm('シミュレーションをリセットしますか？すべてのデータが初期状態に戻ります。')) {
        economicState = {
            gdpGrowth: 2.5,
            inflation: 2.0,
            unemployment: 5.0,
            interestRate: 3.0,
            exchangeRate: 100,
            tradeBalance: 0,
            governmentSpending: 1000,
            tariffRate: 5.0
        };

        history = {
            gdpGrowth: [2.5],
            inflation: [2.0],
            unemployment: [5.0],
            interestRate: [3.0],
            exchangeRate: [100],
            tradeBalance: [0]
        };

        currentTurn = 1;

        // グラフをリセット
        chart.data.labels = ['ターン1'];
        chart.data.datasets[0].data = [2.5];
        chart.data.datasets[1].data = [2.0];
        chart.data.datasets[2].data = [5.0];
        chart.data.datasets[3].data = [3.0];
        chart.update();

        updateDisplay();

        document.getElementById('krugman-commentary').innerHTML = `
            <p>経済は現在、安定した状態にあります。GDP成長率は2.5%で健全な範囲です。</p>
            <p>政策を実行すると、その効果を理論的観点から解説します。</p>
        `;

        document.getElementById('levitt-commentary').innerHTML = `
            <p>インフレ率は目標の2%に近い水準を維持しています。</p>
            <p>政策を実行すると、実際のデータと人々の行動から解説します。</p>
        `;
    }
}

// ===== Gemini API関連の関数 =====

// モーダルを開く
function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('show');

    // 現在のAPI Keyをロード（マスク表示）
    const apiKey = geminiClient.loadAPIKey();
    const input = document.getElementById('api-key-input');
    if (apiKey) {
        input.value = '••••••••••••••••••••••••••••••••';
        input.setAttribute('data-has-key', 'true');
    } else {
        input.value = '';
        input.removeAttribute('data-has-key');
    }

    updateAPIKeyStatus();

    // モーダル外クリックで閉じる
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeSettingsModal();
        }
    };
}

// モーダルを閉じる
function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('show');
}

// API Keyを保存
function saveAPIKey() {
    const input = document.getElementById('api-key-input');
    let apiKey = input.value.trim();

    // マスク表示の場合は既存のキーを保持
    if (input.getAttribute('data-has-key') === 'true' && apiKey.startsWith('••••')) {
        alert('API Keyは既に設定されています。変更する場合は、新しいAPI Keyを入力してください。');
        return;
    }

    if (!apiKey) {
        alert('API Keyを入力してください');
        return;
    }

    if (!apiKey.startsWith('AIza')) {
        alert('API Keyの形式が正しくありません。「AIza」で始まるキーを入力してください。');
        return;
    }

    geminiClient.saveAPIKey(apiKey);
    updateAPIKeyStatus();
    alert('API Keyを保存しました');
    closeSettingsModal();
}

// API Keyを削除
function clearAPIKey() {
    if (confirm('API Keyを削除しますか？')) {
        geminiClient.clearAPIKey();
        document.getElementById('api-key-input').value = '';
        document.getElementById('api-key-input').removeAttribute('data-has-key');
        updateAPIKeyStatus();
        alert('API Keyを削除しました');
    }
}

// API Key設定状態を更新
function updateAPIKeyStatus() {
    const statusDiv = document.getElementById('api-key-status');
    if (!statusDiv) return;

    if (geminiClient.hasAPIKey()) {
        statusDiv.className = 'api-key-status success';
        statusDiv.innerHTML = '✓ API Keyが設定されています';
    } else {
        statusDiv.className = 'api-key-status warning';
        statusDiv.innerHTML = '⚠ API Keyが設定されていません';
    }
}

// 政策分析を実行
async function analyzePolicy() {
    // API Keyのチェック
    if (!geminiClient.hasAPIKey()) {
        alert('API Keyが設定されていません。「⚙️ API設定」ボタンからAPI Keyを設定してください。');
        openSettingsModal();
        return;
    }

    // UIの状態をリセット
    document.getElementById('ai-result').style.display = 'none';
    document.getElementById('ai-error').style.display = 'none';
    document.getElementById('ai-loading').style.display = 'block';

    try {
        // Gemini APIに分析をリクエスト
        const result = await geminiClient.analyzePolicyRecommendation(economicState);

        // 結果を表示
        displayAnalysisResult(result);

    } catch (error) {
        // エラーを表示
        displayAnalysisError(error.message);
    } finally {
        // ローディングを非表示
        document.getElementById('ai-loading').style.display = 'none';
    }
}

// 分析結果を表示
function displayAnalysisResult(result) {
    const resultDiv = document.getElementById('ai-result');
    const contentDiv = document.getElementById('ai-result-content');

    // Markdownをシンプルに変換（改行とボールドのみ）
    const htmlResult = convertMarkdownToHTML(result);

    contentDiv.innerHTML = htmlResult;
    resultDiv.style.display = 'block';

    // スクロール
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 分析エラーを表示
function displayAnalysisError(errorMessage) {
    const errorDiv = document.getElementById('ai-error');
    errorDiv.textContent = '⚠ エラー: ' + errorMessage;
    errorDiv.style.display = 'block';
}

// 分析結果を閉じる
function closeAnalysisResult() {
    document.getElementById('ai-result').style.display = 'none';
}

// シンプルなMarkdown to HTML変換
function convertMarkdownToHTML(markdown) {
    let html = markdown;

    // 見出し変換
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // ボールド
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // リスト
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gim, '<li>$2</li>');

    // リストをラップ
    html = html.replace(/(<li>.*<\/li>)/s, function(match) {
        return '<ul>' + match + '</ul>';
    });

    // 段落
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
        line = line.trim();

        if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('</ul') || line.startsWith('<li')) {
            return line;
        }

        if (line.length === 0) {
            return '';
        }

        return '<p>' + line + '</p>';
    });

    html = processedLines.join('\n');

    return html;
}
