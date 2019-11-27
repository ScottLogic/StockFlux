import React, { useState, useEffect, useCallback } from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import {
  useInterApplicationBusSubscribe,
  useOptions
} from 'openfin-react-hooks';
import { format, subYears } from 'date-fns';
import { ReactComponent as D3FCIcon } from './assets/d3fc.svg';

import './styles/app.css';

const ALL = { uuid: '*' };

const App = () => {
  const [symbol, setSymbol] = useState(null);
  const [chartData, setChartData] = useState(null);

  const [parentUuid, setParentUuid] = useState(null);
  const [listenerSymbol, setListenerSymbol] = useState(null);
  const [name, setName] = useState(null);
  const [options] = useOptions();
  const intentsEnabled = Boolean(
    options && options.customData && options.customData.intentsEnabled
  );

  useEffect(() => {
    if (intentsEnabled) {
      if (options && listenerSymbol !== options.customData.symbol) {
        setListenerSymbol(options.customData.symbol);
        setParentUuid({ uuid: options.uuid });
      }
    } else {
      if (options && options.customData && options.customData.symbol) {
        setSymbol(options.customData.symbol);
        setName(options.customData.name ? options.customData.name : null);
      }
    }
  }, [intentsEnabled, options, listenerSymbol, setSymbol, setName]);

  const { data } = useInterApplicationBusSubscribe(
    parentUuid ? parentUuid : ALL,
    'stockFluxChart:' + listenerSymbol
  );

  if (intentsEnabled) {
    if (data && data.message) {
      if (data.message.symbol && symbol !== data.message.symbol) {
        setSymbol(data.message.symbol);
      }
      if (data.message.name && name !== data.message.name) {
        setName(data.message.name);
      }
    }
  }

  if (!symbol) {
    setSymbol('TSLA');
  }
  if (name == null) {
    setName('Tesla, Inc');
  }

  // if (!date) {
  //   setDate('2019-09-01')
  // }

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
    window.fin.System.openUrlWithBrowser("https://d3fc.io/");
  };

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
