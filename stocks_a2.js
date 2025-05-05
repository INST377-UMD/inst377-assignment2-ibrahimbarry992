const stocks_API_KEY = 'QAYl8LIsavMVXQ8VPBUDQL4hFt0yp2Ha';

const lookUpBtn = document.getElementById('lookUp');
const tickerInp = document.getElementById('inputTicker');
const periodSelect = document.getElementById('period-select');
const chartCanvas = document.getElementById('stockChart');
chartCanvas.style.display = "block";
const redditTable = document.getElementById('top5redditStocks');

let chartInstance = null;

async function fetchStockData(ticker, days) {
    const endDate = new Date();
    const beginDate = new Date();
    beginDate.setDate(endDate.getDate() - days);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const URL = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(beginDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&limit=120&apiKey=${stocks_API_KEY}`;

    const res = await fetch(URL);
    const data = await res.json();

    if (!data.results) {
        alert('Invalid ticker or data unavailable.');
        return null;
    }

    const labels = data.results.map(point => new Date(point.t).toLocaleDateString());
    const values = data.results.map(point => point.c);

    return {labels, values};

}

function chartRender(labels, values, ticker) {
    if (chartInstance) chartInstance.destroy();
  
    chartInstance = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${ticker} Closing Price`,
          data: values,
          borderColor: 'orange',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Price (USD)' } }
        }
      }
    });
  }

  lookUpBtn.addEventListener('click', async () => {
    const ticker = tickerInp.value.toUpperCase();
    const days = parseInt(periodSelect.value);

    if (!ticker) 
        return alert('Please enter a stock ticker.');
    const data = await fetchStockData(ticker, days);
    if (data) chartRender(data.labels, data.values, ticker);
  });

  async function loadRedditTop5() {
    const res = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
    const stocks = await res.json();
    const top5 = stocks.slice(0, 5);

    redditTable.innerHTML = '';

    top5.forEach(stock => {
        const row = document.createElement('tr');

        const link = document.createElement('a');
        link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
        link.target = '_blank';
    link.textContent = stock.ticker;

    const icon = stock.sentiment === 'Bullish' ? '📈' : '📉';

    row.innerHTML = `
      <td>${link.outerHTML}</td>
      <td>${stock.no_of_comments}</td>
      <td>${stock.sentiment} ${icon}</td>
    `;

    redditTable.appendChild(row);
  });
}

if (window.annyang) {
  const commands = {
    'lookup *ticker': async function(ticker) {
      tickerInp.value = ticker.toUpperCase();
      periodSelect.value = '30';
      const data = await fetchStockData(ticker.toUpperCase(), 30);
      if (data) chartRender(data.labels, data.values, ticker.toUpperCase());
    }
  };
  annyang.addCommands(commands);

  const startBtn = document.getElementById('audio-start');
  const stopBtn = document.getElementById('audio-stop');

  startBtn.addEventListener('click', () => {
    console.log('Starting Annyang...');
    annyang.start();
  });

  stopBtn.addEventListener('click', () => {
    console.log('Stopping Annyang...');
    annyang.abort();
  });
}

loadRedditTop5();

