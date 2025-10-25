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

// 経済学者の解説を更新
function updateCommentary(message) {
    const commentary = document.getElementById('economist-commentary');
    commentary.innerHTML = `<p><strong>ターン${currentTurn}の解説:</strong></p>${message}`;
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

    let commentary = '';

    if (change > 0) {
        // 金利上昇
        economicState.gdpGrowth -= 0.3;
        economicState.inflation -= 0.4;
        economicState.unemployment += 0.2;
        economicState.exchangeRate -= 3; // 通貨高

        commentary = `
            <p>金利を引き上げました。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>借入コストが上昇し、企業の投資意欲が減退 → GDP成長率が低下</li>
                <li>消費が抑制され、物価上昇圧力が緩和 → インフレ率が低下</li>
                <li>経済活動が鈍化 → 失業率がやや上昇</li>
                <li>外国資本の流入により自国通貨が上昇</li>
            </ul>
        `;
    } else {
        // 金利低下
        economicState.gdpGrowth += 0.4;
        economicState.inflation += 0.3;
        economicState.unemployment -= 0.2;
        economicState.exchangeRate += 3; // 通貨安

        commentary = `
            <p>金利を引き下げました。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>借入コストが低下し、企業の投資が促進 → GDP成長率が上昇</li>
                <li>消費が増加し、物価が上昇 → インフレ率が上昇</li>
                <li>経済活動が活発化 → 失業率が低下</li>
                <li>外国資本が流出し自国通貨が下落</li>
            </ul>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateCommentary(commentary);
}

// 政府支出調整
function adjustGovernmentSpending(change) {
    economicState.governmentSpending += change;
    economicState.governmentSpending = Math.max(0, economicState.governmentSpending);

    let commentary = '';

    if (change > 0) {
        // 支出増加
        economicState.gdpGrowth += 0.5;
        economicState.inflation += 0.3;
        economicState.unemployment -= 0.3;

        commentary = `
            <p>政府支出を増やしました。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>公共投資や社会保障が拡大 → 総需要が増加しGDP成長率が上昇</li>
                <li>需要増加により物価が上昇 → インフレ率が上昇</li>
                <li>雇用機会が増加 → 失業率が低下</li>
                <li>⚠️ ただし、財政赤字拡大のリスクあり</li>
            </ul>
        `;
    } else {
        // 支出減少
        economicState.gdpGrowth -= 0.4;
        economicState.inflation -= 0.2;
        economicState.unemployment += 0.3;

        commentary = `
            <p>政府支出を減らしました。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>公共投資や社会保障が縮小 → 総需要が減少しGDP成長率が低下</li>
                <li>需要減少により物価上昇圧力が緩和 → インフレ率が低下</li>
                <li>雇用機会が減少 → 失業率が上昇</li>
                <li>✅ 財政健全化には貢献</li>
            </ul>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateCommentary(commentary);
}

// 関税調整
function adjustTariff(change) {
    economicState.tariffRate += change;
    economicState.tariffRate = Math.max(0, Math.min(50, economicState.tariffRate));

    let commentary = '';

    if (change > 0) {
        // 関税引き上げ
        economicState.tradeBalance += 50;
        economicState.inflation += 0.2;
        economicState.gdpGrowth -= 0.2;

        commentary = `
            <p>関税を引き上げました。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>輸入品が高くなり国内産業が保護される → 貿易収支が改善</li>
                <li>輸入品価格の上昇 → インフレ率がやや上昇</li>
                <li>貿易相手国からの報復措置のリスク → GDP成長率がやや低下</li>
                <li>⚠️ 消費者の選択肢が制限される</li>
            </ul>
        `;
    } else {
        // 関税引き下げ
        economicState.tradeBalance -= 50;
        economicState.inflation -= 0.1;
        economicState.gdpGrowth += 0.3;

        commentary = `
            <p>関税を引き下げました。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>輸入品が安くなる → 貿易収支が悪化</li>
                <li>輸入品価格の低下 → インフレ率が低下</li>
                <li>自由貿易促進により経済活性化 → GDP成長率が上昇</li>
                <li>✅ 消費者の選択肢が拡大</li>
            </ul>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateCommentary(commentary);
}

// 為替介入
function adjustExchangeRate(change) {
    economicState.exchangeRate += change;
    economicState.exchangeRate = Math.max(50, Math.min(200, economicState.exchangeRate));

    let commentary = '';

    if (change < 0) {
        // 自国通貨買い（通貨高）
        economicState.inflation -= 0.3;
        economicState.tradeBalance -= 80;
        economicState.gdpGrowth -= 0.2;

        commentary = `
            <p>自国通貨買い介入を実施しました（通貨高）。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>通貨が強くなり輸入品が安くなる → インフレ率が低下</li>
                <li>輸出品が高くなり競争力低下 → 貿易収支が悪化</li>
                <li>輸出産業に打撃 → GDP成長率がやや低下</li>
                <li>✅ 輸入物価安により消費者の購買力が向上</li>
            </ul>
        `;
    } else {
        // 自国通貨売り（通貨安）
        economicState.inflation += 0.3;
        economicState.tradeBalance += 80;
        economicState.gdpGrowth += 0.3;

        commentary = `
            <p>自国通貨売り介入を実施しました（通貨安）。</p>
            <p><strong>効果：</strong></p>
            <ul>
                <li>通貨が弱くなり輸入品が高くなる → インフレ率が上昇</li>
                <li>輸出品が安くなり競争力向上 → 貿易収支が改善</li>
                <li>輸出産業が好調 → GDP成長率が上昇</li>
                <li>⚠️ 輸入物価高により消費者の購買力が低下</li>
            </ul>
        `;
    }

    nextTurn();
    updateDisplay();
    updateChart();
    updateCommentary(commentary);
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

        document.getElementById('economist-commentary').innerHTML = `
            <p>経済は現在、安定した状態にあります。</p>
            <p>GDP成長率は2.5%で健全な範囲です。インフレ率は目標の2%に近い水準を維持しています。</p>
            <p>政策を実行すると、その効果についてここで解説します。</p>
        `;
    }
}
