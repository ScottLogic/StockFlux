import React, {useState} from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import { Intents } from 'stockflux-core';
import { FaNewspaper, FaRegListAlt } from 'react-icons/fa';
import {InterApplicationBusHooks} from 'openfin-react-hooks';

import './styles/app.css';

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

    return (
        <>
            <div className='main'>
                <div className='main-content'>
                    <Components.Titlebar />
                    <div id="showcase-title">
                        <div className="code">
                            {symbol}
                        </div> 
                        <div className="name">
                            {name ? name : 'Generated Data'}
                        </div>
                        <div className="chart-nav-icons">
                            <div className="chart-news-icon" onClick={onNewsClick}>
                                <FaNewspaper />
                            </div>
                            <div className="chart-watchlist-icon" onClick={onWatchlistClick}>
                                <FaRegListAlt />
                            </div>
                        </div>
                    </div>
                    <Chart symbol={symbol}/>
                </div>
            </div>
        </>
    );
};

export default App;
