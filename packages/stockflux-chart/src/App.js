import React, { useState, useEffect } from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import { FaSyncAlt } from 'react-icons/fa';
import {
  useInterApplicationBusSubscribe,
  useOptions
} from 'openfin-react-hooks';
// import bitflux from 'stockflux-bitflux/dist/bitflux';

import './styles/app.css';

const ALL = { uuid: '*' };

// const chart = bitflux.app();
// chart.periodsOfDataToFetch(1200);
// chart.proportionOfDataToDisplayByDefault(112 / 1200);

const App = () => {
  const [symbol, setSymbol] = useState(null);
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

  const getData = symbol => {
    if (symbol) {
      // chart.changeStockFluxProduct(symbol);
    }
  };

  return (
    <>
      <div className="main">
        <div className="main-content">
          <Components.Titlebar />
          <div id="showcase-title">
            {symbol && <div className="code">{symbol}</div>}
            <div className="name">{!symbol ? 'Generated Data' : name}</div>
            <div className="chart-nav-icons">
              <Components.Shortcuts.News
                small={true}
                symbol
                name
                disabled={!symbol}
              />
              <Components.Shortcuts.Watchlist
                small={true}
                symbol
                name
                disabled={!symbol}
              />
              <Components.Buttons.Round
                small={true}
                onClick={() => getData(symbol)}
                disabled={!symbol}
              >
                <FaSyncAlt />
              </Components.Buttons.Round>
            </div>
          </div>
          <Chart symbol="TSLA" date="2019-09-01" />
        </div>
      </div>
    </>
  );
};

export default App;
