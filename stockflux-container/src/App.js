import React, {useState} from 'react';
import * as fdc3 from 'openfin-fdc3';
import {InterApplicationBusHooks} from 'openfin-react-hooks';

let latestChartListener;
let currentChartListener;

let latestNewsListener;
let currentNewsListener;

let chartWindows = [];
let newsWindows = [];

function App() {
  const [content, setContent] = useState(undefined);
  const [newsContent, setNewsContent] = useState(undefined);

  const createWindow = async (context, windowName, isChart) => {
    const parentWindowOptions = await window.fin.Window.getCurrentSync().getOptions();
    const winOption = {
        name: windowName,
        url: isChart ? parentWindowOptions.customData.chartEntryPointUrl : parentWindowOptions.customData.newsEntryPointUrl,
        autoShow: true,
        defaultWidth: isChart ? 850 : 400,
        defaultHeight: isChart ? 500 : 135,
        minWidth: isChart ? 850 : 400,
        minHeight: isChart ? 500 : 135,
        defaultTop: 80,
        saveWindowState: false,
        frame: false,
        resizable: isChart,
        contextMenu: true,
        customData: {
          symbol: context.name,
          apiBaseUrl: parentWindowOptions.customData.apiBaseUrl
        }
    };
    return await window.fin.Window.create(winOption);
  }

  const windowHandler = (context, windows, currentListener, latestListener, isChart) => {
    if (context && currentListener === latestListener) {
      const windowName = (isChart ? 'chart-' : 'news-') + context.name;
      if (!windows.find(window => window === windowName)) {
        createWindow(context, windowName, isChart).then(window => {
          if (isChart) {
            chartWindows = [...windows, windowName];
            setContent({
              symbol: context.name,
              name: context.id.default
            });
          } else {
            newsWindows = [...windows, windowName];
            setNewsContent({
              symbol: context.name,
            });
          }
          window.addListener("closed", () => {
            if (removeWindow(windowName)) {
              closeParentContainer();
            }
          })
        });
      }
    }
  }
  
  const removeWindow = (windowName) => {
    if (windowName.includes('chart')) {
      chartWindows = chartWindows.filter(name => name !== windowName);
    }
    if (windowName.includes('news')) {
      newsWindows = newsWindows.filter(name => name !== windowName);
    }
    return chartWindows.length === 0 && newsWindows.length === 0;
  }
  
  const closeParentContainer = () => {
    window.fin.Window.getCurrentSync().close(true);
  }

  currentChartListener = fdc3.addIntentListener("ViewChart", context => {
    windowHandler(context, chartWindows, currentChartListener, latestChartListener, true);
  });
  InterApplicationBusHooks.usePublish('stockFluxChart:' + (content ? content.symbol : ''), content);
  latestChartListener = currentChartListener;

  currentNewsListener = fdc3.addIntentListener("ViewNews", context => {
    windowHandler(context, newsWindows, currentNewsListener, latestNewsListener, false);
  });
  InterApplicationBusHooks.usePublish('stockFluxNews:' + (newsContent ? newsContent.symbol : ''), newsContent);
  latestNewsListener = currentNewsListener;

  return (
    <></>
  );
}

export default App;
