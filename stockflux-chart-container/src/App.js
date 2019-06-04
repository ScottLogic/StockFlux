import React, {useState} from 'react';
import * as fdc3 from 'openfin-fdc3';
import {InterApplicationBusHooks} from 'openfin-react-hooks';

let latestListener;
let currentListener;
let windows = [];

function App() {
  const [content, setContent] = useState(undefined);
  
  const createWindow = async (context, windowName) => {
    const parentWindowOptions = await window.fin.Window.getCurrentSync().getOptions();
    const winOption = {
        name: windowName,
        url: parentWindowOptions.customData.chartEntryPointUrl,
        autoShow: true,
        defaultWidth: 850,
        defaultHeight: 500,
        minWidth: 850,
        minHeight: 500,
        defaultTop: 80,
        saveWindowState: false,
        frame: false,
        contextMenu: true,
        customData: {
          symbol: context.name,
          apiBaseUrl: parentWindowOptions.customData.apiBaseUrl
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
            if (removeWindow(windowName)) {
              closeParentContainer();
            }
          })
        });
      }
    }
  }
  
  const removeWindow = (windowName) => {
    windows = windows.filter(name => name !== windowName);
    return windows.length === 0;
  }
  
  const closeParentContainer = () => {
    window.fin.Window.getCurrentSync().close(true);
  }

  currentListener = fdc3.addIntentListener("ViewChart", context => handler(context));

  latestListener = currentListener;

  InterApplicationBusHooks.usePublish('stockFlux:' + (content ? content.symbol : ''), content);

  return (
    <></>
  );
}

export default App;
