// 経済指標の状態管理
let economicState = {
    gdpGrowth: 2.5,        // GDP成長率（%）
    inflation: 2.0,        // インフレ率（%）
    unemployment: 5.0,     // 失業率（%）
    interestRate: 3.0,     // 金利（%）
    exchangeRate: 100,     // 為替レート（対ドル）
    tradeBalance: 0,       // 貿易収支（億）
    governmentSpending: 1000,  // 政府支出（億）
    tariffRate: 5.0,       // 関税率（%）

    // Phase 4: 債務関連指標
    governmentDebt: 20000,     // 政府債務残高（億）
    nominalGDP: 10000,         // 名目GDP（億）
    debtToGDP: 200,            // 債務対GDP比率（%）
    interestPayment: 600,      // 利払い費（億/年）20000 × 3.0%
    taxRevenue: 1000,          // 税収（億/年）
    fiscalBalance: -600        // 財政収支（億/年）1000 - 1000 - 600
};

// 履歴データ（グラフ用）
let history = {
    gdpGrowth: [2.5],
    inflation: [2.0],
    unemployment: [5.0],
    interestRate: [3.0],
    exchangeRate: [100],
    tradeBalance: [0],

    // Phase 4: 債務履歴
    governmentDebt: [20000],
    debtToGDP: [200],
    interestPayment: [600],
    fiscalBalance: [-600]
};

let currentTurn = 1;
let chart = null;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    initChart();
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

    // Phase 4: 債務指標の表示
    document.getElementById('debt-value').textContent = economicState.governmentDebt.toFixed(0) + '億';
    document.getElementById('debt-ratio-value').textContent = economicState.debtToGDP.toFixed(1) + '%';
    document.getElementById('interest-payment-value').textContent = economicState.interestPayment.toFixed(0) + '億/年';
    document.getElementById('tax-revenue-value').textContent = economicState.taxRevenue.toFixed(0) + '億/年';
    document.getElementById('nominal-gdp-value').textContent = economicState.nominalGDP.toFixed(0) + '億';

    // 財政収支の表示（赤字/黒字の表記）
    const fiscalBalanceEl = document.getElementById('fiscal-balance-value');
    const fiscalStatusEl = document.getElementById('fiscal-status');
    fiscalBalanceEl.textContent = economicState.fiscalBalance.toFixed(0) + '億';
    if (economicState.fiscalBalance < 0) {
        fiscalBalanceEl.style.color = '#f44336';
        fiscalStatusEl.textContent = '(赤字)';
    } else {
        fiscalBalanceEl.style.color = '#4caf50';
        fiscalStatusEl.textContent = '(黒字)';
    }

    // 債務対GDP比率のステータス
    updateDebtStatus();

    // 債務メーターの更新
    updateDebtMeter();

    // r > g 警告の更新
    updateRGWarning();
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

// 経済学者の解説を更新（3人）
function updateEconomistCommentary(krugmanComment, levittComment, dalioComment = null) {
    const krugmanCommentary = document.getElementById('krugman-commentary');
    const levittCommentary = document.getElementById('levitt-commentary');
    const dalioCommentary = document.getElementById('dalio-commentary');

    // アニメーションをリセットして再適用
    krugmanCommentary.style.animation = 'none';
    levittCommentary.style.animation = 'none';
    if (dalioComment) {
        dalioCommentary.style.animation = 'none';
    }

    setTimeout(() => {
        krugmanCommentary.innerHTML = krugmanComment;
        levittCommentary.innerHTML = levittComment;
        krugmanCommentary.style.animation = 'fadeIn 0.5s ease-in';
        levittCommentary.style.animation = 'fadeIn 0.5s ease-in';

        if (dalioComment) {
            dalioCommentary.innerHTML = dalioComment;
            dalioCommentary.style.animation = 'fadeIn 0.5s ease-in';
        }
    }, 10);
}

// 次のターンへ進む
function nextTurn() {
    currentTurn++;

    // Phase 4: 債務の動態計算
    calculateDebtDynamics();

    // 履歴に追加
    history.gdpGrowth.push(economicState.gdpGrowth);
    history.inflation.push(economicState.inflation);
    history.unemployment.push(economicState.unemployment);
    history.interestRate.push(economicState.interestRate);
    history.exchangeRate.push(economicState.exchangeRate);
    history.tradeBalance.push(economicState.tradeBalance);

    // Phase 4: 債務履歴に追加
    history.governmentDebt.push(economicState.governmentDebt);
    history.debtToGDP.push(economicState.debtToGDP);
    history.interestPayment.push(economicState.interestPayment);
    history.fiscalBalance.push(economicState.fiscalBalance);
}

// Phase 4: 債務の動態計算関数
function calculateDebtDynamics() {
    // 1. 名目GDPの計算（簡易版：前回の名目GDP × (1 + 実質成長率/100) × (1 + インフレ率/100)）
    economicState.nominalGDP = economicState.nominalGDP *
        (1 + economicState.gdpGrowth / 100) *
        (1 + economicState.inflation / 100);

    // 2. 利払い費の計算
    economicState.interestPayment = economicState.governmentDebt * economicState.interestRate / 100;

    // 3. 財政収支の計算（税収 - 政府支出 - 利払い費）
    economicState.fiscalBalance = economicState.taxRevenue -
        economicState.governmentSpending -
        economicState.interestPayment;

    // 4. 債務残高の更新（赤字なら債務増加）
    if (economicState.fiscalBalance < 0) {
        economicState.governmentDebt += Math.abs(economicState.fiscalBalance);
    } else {
        // 黒字なら債務減少
        economicState.governmentDebt -= economicState.fiscalBalance;
        economicState.governmentDebt = Math.max(0, economicState.governmentDebt);
    }

    // 5. 債務対GDP比率の計算
    economicState.debtToGDP = (economicState.governmentDebt / economicState.nominalGDP) * 100;

    // 6. r > g チェック（警告システムは別途実装）
    const nominalGrowthRate = economicState.gdpGrowth + economicState.inflation;
    if (economicState.interestRate > nominalGrowthRate) {
        console.warn(`⚠️ r > g: 金利(${economicState.interestRate.toFixed(1)}%) > 名目成長率(${nominalGrowthRate.toFixed(1)}%)`);
    }
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
        economicState.gdpGrowth += 0.2;  // 現実的には乗数効果は限定的
        economicState.inflation += 0.3;
        economicState.unemployment -= 0.2;  // 雇用創出効果も限定的

        // Phase 4: 債務への影響
        economicState.interestRate += 0.2; // 国債発行増加→金利上昇
        economicState.exchangeRate += 2; // 財政悪化→通貨安

        krugmanComment = `
            <p><strong>典型的なケインジアン政策だ。</strong>需要が不足している時には効果的。</p>
            <p>政府支出は<strong>乗数効果</strong>で経済を刺激し、失業率を下げる。しかし、財源が国債発行なら、債務は支出額以上に増える。</p>
            <p>問題は、<strong>債務の増加 > GDP成長</strong>になりがちだ。短期的な景気刺激と、長期的な債務持続可能性のトレードオフだ。</p>
        `;

        levittComment = `
            <p>政府支出が増えると、誰が得をする？データによると、<strong>支出の30%は非効率に使われる傾向がある</strong>。</p>
            <p>また、企業は政府契約を得ようとロビー活動を増やす。意図しない結果として、民間投資がクラウドアウトされることもある。</p>
            <p>「ヤクザでさえ経済的インセンティブに従う」と私は書いたが、政府も例外ではない。予算が増えれば、無駄遣いのインセンティブも増える。</p>
        `;
    } else {
        // 支出減少
        economicState.gdpGrowth -= 0.3;  // 緊縮の影響はあるが、現実的に調整
        economicState.inflation -= 0.2;
        economicState.unemployment += 0.2;  // 雇用への影響も調整

        krugmanComment = `
            <p><strong>財政緊縮政策だ。</strong>債務を減らすために支出を削減するのは正しい方向だが、タイミングが重要だ。</p>
            <p>短期的にはGDPが下がるが、債務の増加は止まる。<strong>債務対GDP比率は、長期的には改善</strong>する可能性がある。</p>
            <p>ただし、<strong>欧州債務危機</strong>のように、過度な緊縮は「self-defeating」になる。GDPが債務削減より早く縮小すれば、比率は悪化する。バランスが鍵だ。</p>
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
            tariffRate: 5.0,

            // Phase 4: 債務関連指標
            governmentDebt: 20000,
            nominalGDP: 10000,
            debtToGDP: 200,
            interestPayment: 600,
            taxRevenue: 1000,
            fiscalBalance: -600
        };

        history = {
            gdpGrowth: [2.5],
            inflation: [2.0],
            unemployment: [5.0],
            interestRate: [3.0],
            exchangeRate: [100],
            tradeBalance: [0],

            // Phase 4: 債務履歴
            governmentDebt: [20000],
            debtToGDP: [200],
            interestPayment: [600],
            fiscalBalance: [-600]
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

        document.getElementById('dalio-commentary').innerHTML = `
            <p>債務サイクルは歴史的なパターンを繰り返します。</p>
            <p>債務政策を実行すると、「美しいデレバレッジング」の観点から解説します。</p>
        `;
    }
}

// ==================== Phase 4: 債務危機警告システム ====================

// 債務対GDP比率のステータス更新
function updateDebtStatus() {
    const debtStatusEl = document.getElementById('debt-status');
    const debtRatioEl = document.getElementById('debt-ratio-value');
    const ratio = economicState.debtToGDP;

    if (ratio > 250) {
        debtStatusEl.textContent = '🔴 破綻リスク';
        debtStatusEl.style.color = '#d32f2f';
        debtRatioEl.style.color = '#d32f2f';
    } else if (ratio > 150) {
        debtStatusEl.textContent = '🟠 危機レベル';
        debtStatusEl.style.color = '#f57c00';
        debtRatioEl.style.color = '#f57c00';
    } else if (ratio > 90) {
        debtStatusEl.textContent = '🟡 警告レベル';
        debtStatusEl.style.color = '#fbc02d';
        debtRatioEl.style.color = '#fbc02d';
    } else {
        debtStatusEl.textContent = '🟢 健全';
        debtStatusEl.style.color = '#388e3c';
        debtRatioEl.style.color = '#388e3c';
    }
}

// 債務メーターの更新
function updateDebtMeter() {
    const meterBar = document.getElementById('debt-meter-bar');
    const ratio = economicState.debtToGDP;

    // メーターの幅を計算（最大400%として）
    const percentage = Math.min((ratio / 400) * 100, 100);
    meterBar.style.width = percentage + '%';

    // 色を変更
    if (ratio > 250) {
        meterBar.style.background = 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)';
    } else if (ratio > 150) {
        meterBar.style.background = 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)';
    } else if (ratio > 90) {
        meterBar.style.background = 'linear-gradient(90deg, #ffeb3b 0%, #fbc02d 100%)';
    } else {
        meterBar.style.background = 'linear-gradient(90deg, #4caf50 0%, #388e3c 100%)';
    }
}

// r > g 警告の更新
function updateRGWarning() {
    const warningEl = document.getElementById('rg-warning');
    const warningTextEl = document.getElementById('rg-warning-text');

    const r = economicState.interestRate;
    const g = economicState.gdpGrowth + economicState.inflation; // 名目成長率

    if (r > g) {
        warningEl.style.display = 'block';
        warningTextEl.innerHTML = `
            金利 <strong>${r.toFixed(1)}%</strong> > 名目成長率 <strong>${g.toFixed(1)}%</strong><br>
            <small>債務が持続不可能な軌道にあります。債務対GDP比率が加速的に増加します。</small>
        `;
    } else {
        warningEl.style.display = 'none';
    }
}

// ==================== Phase 4: 債務政策関数 ====================

// 1. 国債発行
function issueDebt(amount) {
    economicState.governmentDebt += amount;
    economicState.interestRate += 0.1; // 供給増加で金利上昇
    economicState.exchangeRate += 1; // 財政悪化懸念で通貨安

    const krugmanComment = `
        <p><strong>国債発行は財政赤字のファイナンス手段だ。</strong></p>
        <p>短期的には資金を調達できるが、長期的には債務負担が増加する。
        国債の供給が増えれば、需給関係で金利が上昇し、民間投資がクラウドアウトされるリスクがある。</p>
        <p>重要なのは、<strong>r > g の関係</strong>だ。金利が成長率を上回れば、債務は雪だるま式に増える。</p>
    `;

    const levittComment = `
        <p>政府が借金を増やすと、誰が貸すのか？データによると、多くの場合<strong>中央銀行が最大の買い手</strong>になる。</p>
        <p>これは実質的な<strong>マネー・プリンティング</strong>だ。短期的には問題ないが、
        過度に続けば市場は「この国の通貨は信用できない」と判断し、通貨安とインフレを招く。</p>
        <p>歴史を見れば、アルゼンチン、ジンバブエ、ワイマール共和国...同じパターンの繰り返しだ。</p>
    `;

    const dalioComment = `
        <p><strong>債務サイクルの初期段階だ。</strong></p>
        <p>短期債務サイクルと長期債務サイクルの2つを理解する必要がある。
        国債発行は経済成長を支えるが、<strong>r > g</strong> の状態が続けば、債務は指数関数的に増加する。</p>
        <p>私は何度もこのパターンを見てきた。1920年代のアメリカ、1980年代の日本、2000年代のアメリカ...
        債務が積み上がり、やがて<strong>デレバレッジングの局面</strong>に入る。今はまだその前だ。</p>
    `;

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment, dalioComment);
}

// 2. 増税
function increaseTax(percentage) {
    economicState.taxRevenue += economicState.taxRevenue * (percentage / 100);
    economicState.gdpGrowth -= 0.3; // 増税で消費減少
    economicState.inflation -= 0.2; // 需要減少

    const krugmanComment = `
        <p><strong>増税は財政再建の正攻法だ。</strong>しかし、タイミングが重要だ。</p>
        <p>不況時に増税すれば、経済をさらに冷え込ませる。<strong>財政乗数</strong>は1.5～2程度あり、
        増税の悪影響は大きい。日本の消費税増税の失敗を見れば明らかだ。</p>
        <p>一方、好況時の増税は経済への影響が小さく、債務を削減する好機となる。</p>
    `;

    const levittComment = `
        <p>増税すると何が起きるか？<strong>人々は脱税のインセンティブを持つ</strong>ようになる。</p>
        <p>データによると、税率が10%上がると、地下経済が15%拡大する。
        富裕層はタックスヘイブンに資産を移し、中間層は副業を現金でやり取りするようになる。</p>
        <p>政府が期待するほど税収は増えない。これが<strong>ラッファー曲線</strong>の現実だ。</p>
    `;

    const dalioComment = `
        <p><strong>富の再分配は、美しいデレバレッジングの4要素の1つだ。</strong></p>
        <p>歴史的に見て、債務危機の解決には増税が不可欠だった。しかし、<strong>タイミングと対象が重要</strong>だ。
        富裕層への増税は社会的には受け入れられやすいが、投資と消費を冷え込ませる。</p>
        <p>1930年代のアメリカでは、最高税率が25%から94%に引き上げられた。
        これは<strong>社会的安定</strong>を保つために必要だったが、経済回復を遅らせた側面もある。</p>
    `;

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment, dalioComment);
}

// 3. 緊縮財政
function austerity() {
    economicState.governmentSpending -= 200;
    economicState.governmentSpending = Math.max(100, economicState.governmentSpending);
    economicState.gdpGrowth -= 0.5; // 政府支出削減で需要減少
    economicState.unemployment += 0.4; // 公共部門の雇用削減
    economicState.inflation -= 0.3;

    const krugmanComment = `
        <p><strong>緊縮財政は、不況時には最悪の選択だ。</strong></p>
        <p>2010年代の欧州債務危機を思い出せ。ギリシャ、スペイン、ポルトガルは
        IMFと EUの要求で緊縮財政を実施し、<strong>大不況に陥った</strong>。</p>
        <p>債務対GDP比率はむしろ悪化した。なぜなら、分母のGDPが急激に縮小したからだ。
        これは<strong>self-defeating austerity</strong>（自滅的緊縮）と呼ばれる。</p>
    `;

    const levittComment = `
        <p>政府支出を削減すると、最初に影響を受けるのは誰か？<strong>貧困層と公務員</strong>だ。</p>
        <p>データによると、緊縮財政で最も苦しむのは社会的弱者だ。一方、富裕層は資産を海外に移し、
        影響を回避できる。これは<strong>不平等を拡大</strong>させる政策だ。</p>
        <p>また、公共サービスの質が低下し、犯罪率が上昇する傾向がある。意図しない結果だ。</p>
    `;

    const dalioComment = `
        <p><strong>緊縮財政は、美しいデレバレッジングの4要素の1つだが、単独では危険だ。</strong></p>
        <p>私は「Principles for Navigating Big Debt Crises」で、過度な緊縮が<strong>デフレ性デレバレッジング</strong>を引き起こすと書いた。
        欧州債務危機がその典型例だ。</p>
        <p>緊縮だけでは債務対GDP比率はむしろ悪化する。なぜなら、分母のGDPが分子の債務削減より早く縮小するからだ。
        <strong>バランスの取れたアプローチ</strong>が必要だ。</p>
    `;

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment, dalioComment);
}

// 4. 債務リストラクチャリング
function debtRestructuring() {
    economicState.governmentDebt *= 0.7; // 30%削減
    economicState.interestRate += 2.0; // 信用低下で金利急騰
    economicState.exchangeRate += 10; // 通貨急落
    economicState.gdpGrowth -= 1.5; // 信用危機で経済収縮

    const krugmanComment = `
        <p><strong>債務リストラは、事実上のデフォルトだ。</strong></p>
        <p>アルゼンチンは2001年に、ギリシャは2012年に債務再編を実施した。
        短期的には債務負担が軽減されるが、<strong>国際市場からの信用を失う</strong>。</p>
        <p>金利は急騰し、新たな借り入れは極めて困難になる。経済は深刻な不況に陥り、
        回復には10年以上かかることもある。最後の手段として考えるべきだ。</p>
    `;

    const levittComment = `
        <p>債務を踏み倒すとどうなるか？<strong>信用が崩壊する。</strong></p>
        <p>データによると、デフォルト後の国は平均して15年間、国際資本市場から締め出される。
        金利は3～5倍に跳ね上がり、外国投資は激減する。</p>
        <p>企業は海外に逃げ、富裕層は資産を移転する。残されるのは貧困層だけだ。
        これは<strong>経済的な自殺</strong>に近い選択だ。</p>
    `;

    const dalioComment = `
        <p><strong>債務削減は、美しいデレバレッジングの4要素の1つだが、最も痛みを伴う。</strong></p>
        <p>私は48の債務危機を研究してきた。デフォルトは避けられない場合もある。
        しかし、重要なのは<strong>どのように行うか</strong>だ。</p>
        <p>秩序あるリストラクチャリング（ギリシャ2012年）と無秩序なデフォルト（アルゼンチン2001年）では、
        その後の回復スピードが大きく異なる。債権者との協調が鍵だ。</p>
    `;

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment, dalioComment);
}

// 5. 債務のマネタイゼーション
function debtMonetization() {
    economicState.governmentDebt -= 500; // 中央銀行が500億を引き受け
    economicState.governmentDebt = Math.max(0, economicState.governmentDebt);
    economicState.inflation += 1.5; // マネーサプライ増加でインフレ
    economicState.exchangeRate += 5; // 通貨安
    economicState.interestRate -= 0.3; // 中銀購入で金利低下

    const krugmanComment = `
        <p><strong>これがレイ・ダリオの言う「美しいデレバレッジング」の鍵だ。</strong></p>
        <p>1930年代の大恐慌後、2008年のリーマンショック後、中央銀行は大規模な
        量的緩和（QE）を実施した。これは事実上の債務のマネタイゼーションだ。</p>
        <p>適度に行えばデフレを防ぎ、経済を支える。しかし<strong>過度に行えばハイパーインフレ</strong>を招く。
        バランスが重要だ。</p>
    `;

    const levittComment = `
        <p>中央銀行が政府の借金を肩代わりする。これは<strong>魔法の解決策</strong>に見えるが、実は違う。</p>
        <p>データによると、マネタイゼーションが名目GDP比で30%を超えると、インフレ率は
        平均して2倍になる。50%を超えると、ハイパーインフレのリスクが急上昇する。</p>
        <p>ジンバブエ、ベネズエラ、ワイマール共和国...同じ道を歩んだ国々の末路を見れば、
        この政策の危険性がわかる。<strong>麻薬のようなものだ。</strong></p>
    `;

    const dalioComment = `
        <p><strong>これが「美しいデレバレッジング」の核心だ。</strong></p>
        <p>債務のマネタイゼーションは、4要素の中で最も強力で、最も危険だ。
        適切に行えば、デフレを防ぎ、経済を支える。過度に行えば、ハイパーインフレを招く。</p>
        <p>2008年のリーマンショック後、FRB、ECB、日銀は大規模なQEを実施した。
        これは事実上のマネタイゼーションだが、<strong>インフレ率を2%に抑えた</strong>。
        鍵は、緊縮、債務削減、増税と<strong>バランスを取ること</strong>だ。</p>
    `;

    nextTurn();
    updateDisplay();
    updateChart();
    updateEconomistCommentary(krugmanComment, levittComment, dalioComment);
}
