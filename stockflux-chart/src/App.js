import React, {useEffect,useState} from 'react';
import * as fdc3 from 'openfin-fdc3';
import Chart from './components/Chart';
import Components from 'stockflux-components';

import 'stockflux-bitflux/node_modules/d3fc/dist/d3fc.css';
import 'bootstrap/dist/css/bootstrap.css';
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
import './styles/app.css';
import './styles/BitFlux/sprite.css';

const App = () => {
    const [symbol, setSymbol] = useState(null);
    const [name, setName] = useState(null);

    useEffect(() => {
        fdc3.addIntentListener(fdc3.Intents.VIEW_CHART, context => {
            if (context) {
                setSymbol(context.name);
                setName(context.id.default);
            }
        });
    }, []);

    return ( <>
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