import { useEffect, useState } from 'react';

export const ScreenEdge = {
  NONE: 'none',
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right'
};

const defaultState = {
  edge: ScreenEdge.NONE
};

const barHeight = 50;
const barWidth = 50;
const animationDuration = 250;

const withOpenFin = () => {
  if (!window || !window.fin) {
    throw new Error('This React hook requires the OpenFin API');
  }
  return window.fin;
};

const getEdgeLocation = (edge, { primaryMonitor: { availableRect } }) => ({
  position: {
    duration: animationDuration,
    relative: false,
    left: edge !== ScreenEdge.RIGHT ? 0 : availableRect.right - barWidth,
    top: 0
  },
  size: {
    duration: animationDuration,
    relative: false,
    width: edge === ScreenEdge.TOP || edge === ScreenEdge.NONE ? availableRect.right - availableRect.left : barWidth,
    height: edge === ScreenEdge.TOP || edge === ScreenEdge.NONE ? barHeight : availableRect.bottom - availableRect.top
  }
});

export default (currentWindowState = defaultState) => {
  const [windowState, setWindowState] = useState(currentWindowState);

  useEffect(() => {
    const doWindowActions = async () => {
      const currentWindow = await withOpenFin().Window.getCurrent();
      const monitorInfo = await withOpenFin().System.getMonitorInfo();

      currentWindow.addListener('bounds-changed', bounds => setWindowState({ ...windowState, bounds }));

      const transitionTo = getEdgeLocation(windowState.edge, monitorInfo);
      const transitionOptions = { interrupt: true, relative: false };

      currentWindow.animate(transitionTo, transitionOptions);
    };

    const undoWindowActions = async () => {
      const currentWindow = await withOpenFin().Window.getCurrent();

      currentWindow.removeAllListeners('bounds-changed');
    };

    doWindowActions();

    return undoWindowActions;
  }, [windowState.edge]);

  const setEdge = (edgeLocation) => {
    if (windowState && windowState.edge !== edgeLocation) {
      setWindowState({ ...windowState, edge: edgeLocation });
    }
  };

  console.log(windowState);
  return [windowState, {
    lockTop: () => setEdge(ScreenEdge.TOP),
    lockLeft: () => setEdge(ScreenEdge.LEFT),
    lockRight: () => setEdge(ScreenEdge.RIGHT)
  }];
};