import React, { useState, useEffect, useCallback } from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import { useOptions } from 'openfin-react-hooks';
import { format, subYears } from 'date-fns';
import { ReactComponent as D3FCIcon } from './assets/d3fc.svg';

import './styles/app.css';

const App = () => {
  const [symbol, setSymbol] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [name, setName] = useState(null);
  const [options] = useOptions();

  useEffect(() => {
    if (options && options.customData && options.customData.symbol) {
      setSymbol(options.customData.symbol);
      setName(options.customData.name ? options.customData.name : null);
    }
  }, [options, setSymbol, setName]);

  if (!symbol) {
    setSymbol('TSLA');
  }
  if (name == null) {
    setName('Tesla, Inc');
  }

  const getData = useCallback(async () => {
    var date = format(subYears(new Date(), 3), 'YYYY-MM-DD');
    var url = `https://d3capoqa8f983r.cloudfront.net/api/ohlc/${symbol}/${date}`;

    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) throw new Error('response not successful');

    const stockData = await response.json();
    if (!stockData.success) throw new Error('Not successful');

    const updated = stockData.data.map(item => {
      return {
        open: item.open,
        close: item.close,
        high: item.high,
        low: item.low,
        volume: item.volume,
        date: new Date(item.date)
      };
    });

    return updated;
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      getData().then(data => setChartData(data));
    } else setChartData();
  }, [symbol, getData]);

  function handleD3FCClick() {
    window.fin.System.openUrlWithBrowser('https://d3fc.io/');
  }

  return (
    <>
      <div className="main">
        <Components.Titlebar />
        <div className="chart-stuff">
          <div className="symbol-info">
            {symbol && <div className="code">{symbol}</div>}
            <div className="name">{!symbol ? 'Generated Data' : name}</div>
          </div>
          <Chart chartData={chartData} />
        </div>
        <div className="chart-info">
          <div className="chart-tool">Powered by</div>
          <div className="d3fc-button">
            <D3FCIcon onClick={() => handleD3FCClick()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
