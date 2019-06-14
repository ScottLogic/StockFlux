import React, {useState} from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import { Intents } from 'stockflux-core';
import { FaNewspaper, FaRegListAlt, FaSyncAlt } from 'react-icons/fa';
import {InterApplicationBusHooks} from 'openfin-react-hooks';
import bitflux from 'stockflux-bitflux/dist/bitflux';

import './styles/app.css';

const chart = bitflux.app();
chart.periodsOfDataToFetch(1200);
chart.proportionOfDataToDisplayByDefault(112/1200);

const App = () => {
    const [symbol, setSymbol] = useState(null);
    const [parentUuid, setParentUuid] = useState(null);
    const [listenerSymbol, setListenerSymbol] = useState(null);
    const [name, setName] = useState(null);

    window.fin.Window.getCurrentSync().getOptions().then((options) => {
        if (listenerSymbol !== options.customData.symbol) {
            setListenerSymbol(options.customData.symbol);
            setParentUuid(options.uuid);
        }
    });

    const { data } = InterApplicationBusHooks.useSubscription(parentUuid ? parentUuid : '*', '', 'stockFluxChart:'+listenerSymbol);

    if (data && data.length > 0 && data[0]) {
        if (data[0].symbol && symbol !== data[0].symbol) {
            setSymbol(data[0].symbol);
        }
        if (data[0].name && name !== data[0].name) {
            setName(data[0].name);
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
                                <FaNewspaper />
                            </div>
                            <div className={"chart-nav-icon" + (symbol ? '' : ' icon-disabled')} onClick={onWatchlistClick}>
                                <FaRegListAlt />
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
