import React, {useState} from 'react';
import * as fdc3 from 'openfin-fdc3';
import {InterApplicationBusHooks} from 'openfin-react-hooks';

let latestListener;
let currentListener;
let windows = [];

function App() {
  const [content, setContent] = useState(undefined);
  
  const createWindow = async (context, windowName) => {
    const winOption = {
        name: windowName,
        url: 'https://lf467ndb08.execute-api.eu-west-2.amazonaws.com/dev/artifacts/stockflux-chart/v0.0.1/index.html',
        autoShow: true,
        defaultWidth: 850,
        defaultHeight: 500,
        minWidth: 850,
        minHeight: 500,
        frame: false,
        contextMenu: true,
        customData: {
          symbol: context.name,
          apiBaseUrl: 'https://lf467ndb08.execute-api.eu-west-2.amazonaws.com/dev/api'
        }
    };
    return await window.fin.Window.create(winOption);
  }

  const handler = (context) => {
    if (context && currentListener === latestListener) {
      const windowName = 'container-' + context.name;
      if (!windows.find(window => window === windowName)) {
        createWindow(context, windowName).then(chartWindow => {
          windows = [...windows, windowName];
          setContent({
            symbol: context.name,
            name: context.id.default
          });
          chartWindow.addListener("closed", () => {
            if (wasFinalChartWindow(windowName)) {
              window.fin.Window.getCurrentSync().close(true);
            }
          })
        });
      }
    }
  }
  
  const wasFinalChartWindow = (windowName) => {
    windows = windows.filter(name => name !== windowName);
    return windows.length === 0 ? true : false;
  }

  currentListener = fdc3.addIntentListener("ViewChart", context => handler(context));

  latestListener = currentListener;

  InterApplicationBusHooks.usePublish('stockFlux:' + (content ? content.symbol : ''), content);

  return (
    <></>
  );
}

export default App;
