function extractDataArrays(data) {
    const priceData = [];
    const gtData = [];
    const btData = [];
    const tsData = [];
  
    for (const item of data) {
      const time = new Date(item.time).getTime(); // Convert date string to timestamp
  
      priceData.push({ time: time, value: parseFloat(item.price) });
      gtData.push({ time: time, value: parseFloat(item.gt) });
      btData.push({ time: time, value: parseFloat(item.bt) });
      tsData.push({ time: time, value: parseFloat(item.ts) });
    }
  
    return {
      priceData,
      gtData,
      btData,
      tsData
    };
  }

function extractDataArraysByTime(data, startDate) {
  const priceData = [];
  const gtData = [];
  const btData = [];
  const tsData = [];

  const startTime = new Date(startDate);
  const endTime = new Date();

  for (const item of data) {
    const time = new Date(item.time).getTime(); // Convert date string to timestamp

    if (time >= startTime.getTime() && time <= endTime.getTime()) {
      priceData.push({ time: time, value: parseFloat(item.price) });
      gtData.push({ time: time, value: parseFloat(item.gt) });
      btData.push({ time: time, value: parseFloat(item.bt) });
      tsData.push({ time: time, value: parseFloat(item.ts) });
    }
  }

  return {
    priceData,
    gtData,
    btData,
    tsData
  };
}
  

const crosshairplugins = {
  tooltip: {
    mode: 'interpolate',
    intersect: false
  },
  crosshair: {
    line: {
      color: '#F66',  // crosshair line color
      width: 1        // crosshair line width
    },
    sync: {
     //  enabled: true,            // enable trace line syncing with other charts
      group: 1,                 // chart group
      suppressTooltips: false   // suppress tooltips when showing a synced tracer
    },
    zoom: {
      enabled: true,                                      // enable zooming
      zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',     // background color of zoom box 
      zoomboxBorderColor: '#48F',                         // border color of zoom box
      zoomButtonText: 'Reset Zoom',                       // reset zoom button text
      zoomButtonClass: 'reset-zoom',                      // reset zoom button class
    },
    callbacks: {
      beforeZoom: () => function(start, end) {                  // called before zoom, return false to prevent zoom
        return true;
      },
      afterZoom: () => function(start, end) {                   // called after zoom
      }
    }
  }
}


async function getBTCTrendData() {
  let url = 'https://open-api.coinglass.com/public/v2/index/bitcoin_bubble_index';
  try {
      const response = await getResponse(url, {});
      
      const data = await response.json();
      return data;
  } catch (error) {
      console.error(error);
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



function graphData(priceData, gtData, btData, tsData) {
  // Chart 1: Price Data
  const priceLabels = priceData.map((data) => new Date(data.time).toLocaleDateString());
  const priceValues = priceData.map((data) => data.value);
  const priceChart = new Chart(document.getElementById('chart1'), {
    type: 'line',
    data: {
      labels: priceLabels,
      datasets: [{
        label: 'BTC Price (usd)',
        data: priceValues,
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          animation: false,
          mode: "interpolate",
          intersect: false,
        }
      }
    }
  });

  // Chart 2: GT Data
  const gtLabels = gtData.map((data) => new Date(data.time).toLocaleDateString());
  const gtValues = gtData.map((data) => data.value);
  const gtChart = new Chart(document.getElementById('chart2'), {
    type: 'line',
    data: {
      labels: gtLabels,
      datasets: [{
        label: 'BTC Google Trends',
        data: gtValues,
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Chart 3: BT Data
  const btLabels = btData.map((data) => new Date(data.time).toLocaleDateString());
  const btValues = btData.map((data) => data.value);
  const btChart = new Chart(document.getElementById('chart3'), {
    type: 'line',
    data: {
      labels: btLabels,
      datasets: [{
        label: 'BTC Chain Transactions',
        data: btValues,
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: 'rgba(0, 255, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Chart 4: TS Data
  const tsLabels = tsData.map((data) => new Date(data.time).toLocaleDateString());
  const tsValues = tsData.map((data) => data.value);
  const tsChart = new Chart(document.getElementById('chart4'), {
    type: 'line',
    data: {
      labels: tsLabels,
      datasets: [{
        label: 'BTC Twitter Mentions',
        data: tsValues,
        backgroundColor: 'rgba(255, 255, 0, 0.2)',
        borderColor: 'rgba(255, 255, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  priceChart.update()
  gtChart.update()
  btChart.update()
  tsChart.update()
}





async function startCharts() {
  let res = await getBTCTrendData()
  const startDate = document.getElementById('start-date-selector').value;
  let fres = extractDataArraysByTime(res.data, startDate)
  graphData(fres.priceData, fres.gtData, fres.btData, fres.tsData)
}



