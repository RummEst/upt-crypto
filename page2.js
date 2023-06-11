function getMilliseconds(range) {
    switch (range) {
      case '1d':
        return 86400000;
      case '7d':
        return 604800000;
      case '30d':
        return 2592000000;
      default:
        return 86400000;
    }
  }
  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
    
  const coinDataCache = {};
  
  const selectedCoins = new Set();
  
  
  const refreshButton = document.querySelector('#refresh-button');
  refreshButton.addEventListener('click', async function() {
    const coin = document.querySelector('#coin-selector').value;
  
    if (!selectedCoins.has(coin)) {
      selectedCoins.add(coin);
      const coinElement = document.createElement('span');
      coinElement.textContent = coin;
      coinElement.className = 'selected-coin';
      coinElement.dataset.coin = coin;
      document.querySelector('#coin-list').appendChild(coinElement);
  
      // Remove the coin from the list when clicked
      coinElement.addEventListener('click', async () => {
        coinElement.remove();
        selectedCoins.delete(coin);
        await updateChart(myChart, selectedCoins, coinDataCache);
        if (selectedCoins.size === 0) {
          document.querySelector('#interval-selector').disabled = false;
          document.querySelector('#range-selector').disabled = false;
        }
      });
  
      if (selectedCoins.size === 1) {
        document.querySelector('#interval-selector').disabled = true;
        document.querySelector('#range-selector').disabled = true;
      }
    }

    let timeframe = getTimeframe()    
  
    console.log(`Coin: ${coin}, Interval: ${timeframe.interval}, Range: ${timeframe.range}, \n StartTime: ${timeframe.startTime}, EndTime: ${timeframe.endTime}`);
    
  
    await updateChart(myChart, selectedCoins, coinDataCache, timeframe);
  });
  
  function getTimeframe () {
    let timeframe = {
      interval: document.querySelector('#interval-selector').value,
      range: document.querySelector('#range-selector').value,
      startTime: Date.now() - getMilliseconds(document.querySelector('#range-selector').value),
      endTime: Date.now()
    };
    return timeframe
  }

  async function updateChart(chart, selectedCoins, coinDataCache, timeframe={}) {
    console.log(coinDataCache)
    showBox();
    let maxCoinsINT = selectedCoins.size
    chart.data.datasets = []; // clear chart
    let i = 0
    for (const selectedCoin of selectedCoins) {
      if (!coinDataCache[selectedCoin]) {
        const outData = await getLongShortData(selectedCoin, timeframe.interval, timeframe.startTime, timeframe.endTime);
        console.log(outData);
        coinDataCache[selectedCoin] = transformData(outData.data);
      }
  
      const color = getRandomColor();
      const newDataset = {
        label: `${selectedCoin}`,
        data: coinDataCache[selectedCoin],
        borderColor: color,
        backgroundColor: color + '33', // Add transparency to the color
        borderWidth: 2,
        fill: false,
        tension: 0.2
      };
      chart.data.datasets.push(newDataset);
      i++;
      setProgress(parseInt(Math.round((i / maxCoinsINT) * 100)))
    }
  
    chart.update();
    hideBox()
  }
  
  
  
  async function getLongShortData(symbol, interval, startTime, endTime) {
    let url = `https://open-api.coinglass.com/public/v2/indicator/funding_avg?symbol=${symbol}&interval=${interval}&start_time=${startTime}&end_time=${endTime}`;
    try {
        const response = await getResponse(url, {});
        
        const data = await response.json();
        return data;
    } catch (error) {
        return console.error(error);
    }
  }
    
  async function getResponse(url, headers) {
    try {
      const response = await fetch(backEndPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          headers: headers
        })
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
    
  document.querySelector('#interval-selector').addEventListener('change', () => {
    coinDataCache.length = 0; // Clear the cache
    updateChart(myChart, selectedCoins, coinDataCache);
  });
  
  document.querySelector('#range-selector').addEventListener('change', () => {
    coinDataCache.length = 0; // Clear the cache
    updateChart(myChart, selectedCoins, coinDataCache);
  });
  
  
// Set up a function to store the selectedCoins variable in local storage
function storeSelectedCoins() {
  const selectedCoinsArray = Array.from(selectedCoins);
  localStorage.setItem('selectedCoinsFunding', JSON.stringify(selectedCoinsArray));
}

// Call the storeSelectedCoins function every 10 seconds using setInterval
setInterval(storeSelectedCoins, 10000);


// Set up a function to get the selectedCoins variable from local storage and loop through it
async function loadSelectedCoins() {
  // Get the selectedCoins variable from local storage, if it exists
  const selectedCoinsJSON = localStorage.getItem('selectedCoinsFunding');
  if (selectedCoinsJSON) {
    // Convert the JSON string back into an array of coin symbols
    const selectedCoinsArray = JSON.parse(selectedCoinsJSON);
    console.log("restoreCoinSelection (Funding) -> " + selectedCoinsArray.join("; "));
    // Loop through each coin symbol and call the addCoinSelection function
    selectedCoinsArray.forEach((coin) => {
      addCoinSelection(coin);
    });
  }
  console.log("updateChart");
  await updateChart(myChart, selectedCoins, coinDataCache, getTimeframe());
}

// Call the loadSelectedCoins function after the page loads
window.addEventListener('load', loadSelectedCoins);


function addCoinSelection (coin) {
  if (!selectedCoins.has(coin)) {
    selectedCoins.add(coin);
    const coinElement = document.createElement('span');
    coinElement.textContent = coin;
    coinElement.className = 'selected-coin';
    coinElement.dataset.coin = coin;
    document.querySelector('#coin-list').appendChild(coinElement);

    // Remove the coin from the list when clicked
    coinElement.addEventListener('click', async () => {
      coinElement.remove();
      selectedCoins.delete(coin);
      await updateChart(myChart, selectedCoins, coinDataCache);
      if (selectedCoins.size === 0) {
        document.querySelector('#interval-selector').disabled = false;
        document.querySelector('#range-selector').disabled = false;
      }
    });

    if (selectedCoins.size === 1) {
      document.querySelector('#interval-selector').disabled = true;
      document.querySelector('#range-selector').disabled = true;
    }
  }
}
  
  