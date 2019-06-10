import React, {useState} from 'react';
import * as fdc3 from 'openfin-fdc3';

let latestChartListener;

let latestNewsListener;

let windows = [];

function App() {
  const [content, setContent] = useState(undefined);
  const [newsContent, setNewsContent] = useState(undefined);

  const { InterApplicationBus } = window.fin;

  const createWindow = async (context, windowName) => {
    const parentWindowOptions = await window.fin.Window.getCurrentSync().getOptions();
    const manifestOptions = await fetch(`${parentWindowOptions.customData.apiBaseUrl}/apps/v1/${context.appName}/app.json`, {
      method: 'GET',
    });
    const windowOptions = await manifestOptions.json();
    const winOption = {
      ...windowOptions.startup_app,
      // uuid must match that of the parent window
      uuid: "stockflux-container",
      name: windowName,
      customData: {
        symbol: context.name,
        apiBaseUrl: parentWindowOptions.customData.apiBaseUrl
      }
    };
    return await window.fin.Window.create(winOption);
  }

  const windowHandler = async (context, currentListener, latestListener, isChart) => {
    if (context && currentListener === latestListener) {
      const windowName = context.appName + '-' + context.name;
      if (!windows.find(window => window === windowName)) {
          const window = await createWindow(context, windowName);
          if (window) {
            windows = [...windows, windowName];
            if (isChart) {
              setContent({
                symbol: context.name,
                name: context.id.default
              });
            } else {
              setNewsContent({
                symbol: context.name,
              });
            }
            window.addListener("closed", () => {
              if (removeWindow(windowName)) {
                closeParentContainer();
              }
            })
          }
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

  const currentChartListener = fdc3.addIntentListener("ViewChart", context => {
    windowHandler(context, currentChartListener, latestChartListener, true);
  });
  latestChartListener = currentChartListener;

  if (InterApplicationBus && content && content.symbol) {
    InterApplicationBus.publish('stockFluxChart:' + content.symbol, content)
  }
  
  const currentNewsListener = fdc3.addIntentListener("ViewNews", context => {
    windowHandler(context, currentNewsListener, latestNewsListener, false);
  });
  latestNewsListener = currentNewsListener;
  
  if (InterApplicationBus && newsContent && newsContent.symbol) {
    InterApplicationBus.publish('stockFluxNews:' + newsContent.symbol, newsContent)
  }

  return (
    <></>
  );
}

export default App;
