import React, {useState} from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import {InterApplicationBusHooks} from 'openfin-react-hooks';

import 'stockflux-bitflux/node_modules/d3fc/dist/d3fc.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'stockflux-components/src/components/spinner/Spinner.css';

import './styles/BitFlux/primary.css';
import './styles/BitFlux/variables.css';
import './styles/BitFlux/base.css';
import './styles/BitFlux/flex.css';
import './styles/BitFlux/menu.css';
import './styles/BitFlux/selectors.css';
import './styles/BitFlux/dropdown.css';
import './styles/BitFlux/axis.css';
import './styles/BitFlux/overlay.css';
import './styles/BitFlux/navigator.css';
import './styles/BitFlux/charts.css';
import './styles/BitFlux/head.css';
import './styles/BitFlux/secondary.css';
import './styles/BitFlux/legend.css';
import './styles/BitFlux/closeLine.css';
import './styles/BitFlux/loading.css';
import './styles/BitFlux/notification.css';
import './styles/BitFlux/sprite.css';

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

    const { data } = InterApplicationBusHooks.useSubscription(parentUuid ? parentUuid : '*', '', 'stockFlux:'+listenerSymbol);

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