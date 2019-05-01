import React from 'react';
import Chart from './components/chart';
import Components from 'stockflux-components';

import '../node_modules/BitFlux/node_modules/d3fc/dist/d3fc.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
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
    return ( <>
        <div className='main'>
            <div className='main-content'>
                <Components.Titlebar />
                <Chart />
            </div>
        </div>
        </>
    );
};

export default App;