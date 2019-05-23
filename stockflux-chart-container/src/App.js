import React, {useState} from 'react';
import * as fdc3 from 'openfin-fdc3';
import {InterApplicationBusHooks} from 'openfin-react-hooks';

let latestListener;

function App() {
  const [content, setContent] = useState(undefined);
  const [windows, setWindows] = useState([]);

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

  const currentListener = fdc3.addIntentListener("ViewChart", context => {
    if (context && currentListener === latestListener) {
      const windowName = 'container-' + context.name;
      createWindow(context, windowName).then(chartWindow => {
        setWindows([...windows, windowName]);
        setContent({
          symbol: context.name,
          name: context.id.default
        });
        chartWindow.addListener("closed", () => {
          let newWindows = [...windows];
          newWindows.splice(newWindows.indexOf(windowName));
          setWindows(newWindows);
        })
      });
    }
  });

  latestListener = currentListener;

  InterApplicationBusHooks.usePublish('stockFlux:' + (content ? content.symbol : ''), content);

  return (
    <></>
  );
}

export default App;
