import React from 'react';
import * as fdc3 from 'openfin-fdc3';
import { useOptions } from 'openfin-react-hooks';
import { OpenfinApiHelpers } from 'stockflux-core';

let latestChartListener;

let latestNewsListener;

let windows = [];

function App() {
  const { InterApplicationBus } = window.fin;
  const [options] = useOptions();

  const createWindow = async (context, windowName) => {
    const manifestOptions = await fetch(
      `${options.customData.apiBaseUrl}/apps/v1/${context.appName}/app.json`,
      {
        method: 'GET'
      }
    );
    const windowOptions = await manifestOptions.json();
    const childWindowOptions = {
      ...windowOptions.startup_app,
      // uuid must match that of the parent window
      uuid: 'stockflux-container',
      name: windowName,
      customData: {
        symbol: context.name,
        apiBaseUrl: options.customData.apiBaseUrl
      }
    };

    OpenfinApiHelpers.createWindow(childWindowOptions)
      .then(win => {
        return win;
      })
      .catch(error => {
        console.error('Error! Window could not be created. ', error);
        return undefined;
      });
  };

  const windowHandler = async (
    context,
    currentListener,
    latestListener,
    isChart
  ) => {
    if (options && context && currentListener === latestListener) {
      const windowName = context.appName + '-' + context.name;
      if (!windows.find(window => window === windowName)) {
        const window = await createWindow(context, windowName);
        if (window) {
          windows = [...windows, windowName];
          if (isChart) {
            InterApplicationBus.publish('stockFluxChart:' + context.name, {
              symbol: context.name,
              name: context.id.default
            });
          } else {
            InterApplicationBus.publish('stockFluxNews:' + context.name, {
              symbol: context.name,
              name: context.companyName
            });
          }
          window.addListener('closed', () => {
            if (removeWindow(windowName)) {
              closeParentContainer();
            }
          });
        }
      }
    }
  };

  const removeWindow = windowName => {
    windows = windows.filter(name => name !== windowName);
    return windows.length === 0;
  };

  const closeParentContainer = () => {
    OpenfinApiHelpers.getCurrentWindowSync().close(true);
  };

  const currentChartListener = fdc3.addIntentListener('ViewChart', context => {
    windowHandler(context, currentChartListener, latestChartListener, true);
  });
  latestChartListener = currentChartListener;

  const currentNewsListener = fdc3.addIntentListener('ViewNews', context => {
    windowHandler(context, currentNewsListener, latestNewsListener, false);
  });
  latestNewsListener = currentNewsListener;

  return <></>;
}

export default App;
