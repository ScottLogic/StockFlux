import React, {useState} from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import { StockFluxHooks } from 'stockflux-core';
import {InterApplicationBusHooks} from 'openfin-react-hooks';

import './styles/app.css';

const App = () => {
    const [symbol, setSymbol] = StockFluxHooks.useLocalStorage('chartSymbol', null);
    const [parentUuid, setParentUuid] = useState(null);
    const [listenerSymbol, setListenerSymbol] = useState(null);
    const [name, setName] = StockFluxHooks.useLocalStorage('chartName', null);

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

    return (
        <>
            <div className='main'>
                <div className='main-content'>
                    <Components.Titlebar />
                    <div id="showcase-title">
                        <div className="code">{symbol}</div> <div className="name">{name ? name : 'Generated Data'}</div>
                    </div>
                    <Chart symbol={symbol}/>
                </div>
            </div>
        </>
    );
};

export default App;
