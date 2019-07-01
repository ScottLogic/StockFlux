import React, {useState} from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import { Intents, StockFluxHooks } from 'stockflux-core';
import { FaSyncAlt } from 'react-icons/fa';
import {useInterApplicationBusSubscribe} from 'openfin-react-hooks';
import bitflux from 'stockflux-bitflux/dist/bitflux';

import './styles/app.css';

const ALL = { uuid: '*' };

const chart = bitflux.app();
chart.periodsOfDataToFetch(1200);
chart.proportionOfDataToDisplayByDefault(112/1200);

const App = () => {
    const [symbol, setSymbol] = StockFluxHooks.useLocalStorage('chartSymbol', null);
    const [parentUuid, setParentUuid] = useState(null);
    const [listenerSymbol, setListenerSymbol] = useState(null);
    const [name, setName] = StockFluxHooks.useLocalStorage('chartName', null);

    window.fin.Window.getCurrentSync().getOptions().then((options) => {
        if (listenerSymbol !== options.customData.symbol) {
            setListenerSymbol(options.customData.symbol);
            setParentUuid({ uuid: options.uuid });
        }
    });

    const { data } = useInterApplicationBusSubscribe(parentUuid ? parentUuid : ALL, 'stockFluxChart:'+listenerSymbol);
    if (data && data.message) {
        if (data.message.symbol && symbol !== data.message.symbol) {
            setSymbol(data.message.symbol);
        }
        if (data.message.name && name !== data.message.name) {
            setName(data.message.name);
        }
    }

    const onNewsClick = () => {
        if (symbol) {
            Intents.viewNews(symbol);
        }
    }

    const onWatchlistClick = () => {
        if (symbol && name) {
            Intents.addWatchlist(symbol, name);
        }
    }

    const getData = (symbol) => {
        if (symbol) {
            chart.changeStockFluxProduct(symbol);
        }
    }

    return (
        <>
            <div className='main'>
                <div className='main-content'>
                    <Components.Titlebar />
                    <div id="showcase-title">
                        {symbol && (
                            <div className="code">
                                {symbol}
                            </div>
                        )}
                        <div className="name">
                            {name ? name : 'Generated Data'}
                        </div>
                        <div className="chart-nav-icons">
                            <div className={"chart-nav-icon" + (symbol ? '' : ' icon-disabled')} onClick={onNewsClick}>
                                <Components.News />
                            </div>
                            <div className={"chart-nav-icon" + (symbol ? '' : ' icon-disabled')} onClick={onWatchlistClick}>
                                <Components.Watchlist />
                            </div>
                            <div className={"chart-nav-icon" + (symbol ? '' : ' icon-disabled')} onClick={() => getData(symbol)}>
                                <FaSyncAlt />
                            </div>
                        </div>
                    </div>
                    <Chart getData={getData} chart={chart} symbol={symbol}/>
                </div>
            </div>
        </>
    );
};

export default App;
