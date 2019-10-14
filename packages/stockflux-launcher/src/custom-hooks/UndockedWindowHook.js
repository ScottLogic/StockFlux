import { useEffect, useRef, useState } from 'react';

import transitions from './useDockWindow.transitions';

let usePreviousValue = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const getMonitorRect = async bounds => {
  const monitorInfo = await window.fin.System.getMonitorInfo();
  return (
    monitorInfo.nonPrimaryMonitors
      .concat(monitorInfo.primaryMonitor)
      .map(info => info.availableRect)
      .find(
        rect =>
          bounds.left >= rect.left &&
          bounds.left + bounds.width <= rect.right &&
          bounds.top >= rect.top &&
          bounds.top + bounds.height <= rect.bottom
      ) || monitorInfo.primaryMonitor.availableRect
  );
};

export default (
  initialEdge = 'none',
  toMove = window.fin.Window.getCurrentSync(),
  allowUserToUndock = true,
  stretchToFit,
  options
) => {
  const [edge, setEdge] = useState(initialEdge);
  const [isUndocking, setIsUndocking] = useState(false);
  const previousEdge = usePreviousValue(edge);

  useEffect(() => {
    const handleBoundsChanged = event => {
      if (event.reason === 'animation' || event.changeType === 1) {
        return;
      }

      setEdge('none');
    };

    toMove.addListener('bounds-changed', handleBoundsChanged);

    return () => {
      toMove.removeListener('bounds-changed', handleBoundsChanged);
    };
  }, [toMove]);

  useEffect(() => {
    if (!toMove.enableUserMovement || !toMove.disableUserMovement) {
      return; // window not initialised yet
    }

    if (edge === 'none') {
      toMove.enableUserMovement();
    } else if (!allowUserToUndock) {
      toMove.disableUserMovement();
    }

    return () => {
      if (toMove.enableUserMovement) {
        toMove.enableUserMovement();
      }
    };
  }, [edge, toMove, allowUserToUndock]);

  useEffect(() => {
    const performDockTransition = async () => {
      const bounds = await toMove.getBounds();
      const monitorRect = await getMonitorRect(bounds);
      const transition = stretchToFit
        ? transitions.stretchedDock(edge, monitorRect, stretchToFit)
        : transitions.dock(edge, monitorRect, bounds);

      await toMove.animate(transition, { interrupt: true });
    };

    if (edge !== 'none') {
      performDockTransition();
    }
  }, [edge, stretchToFit, toMove]);

  useEffect(() => {
    const performUndockTransition = async () => {
      const bounds = await toMove.getBounds();
      const monitorRect = await getMonitorRect(bounds);
      const transition = stretchToFit
        ? transitions.stretchedUndock(
            previousEdge,
            monitorRect,
            stretchToFit,
            options
          )
        : transitions.undock(previousEdge, bounds, options);

      await toMove.animate(transition, { interrupt: true });
      setIsUndocking(false);
    };

    if (isUndocking) {
      performUndockTransition();
    }
  }, [isUndocking, options, previousEdge, stretchToFit, toMove]);

  return [
    edge,
    {
      dockBottom: () => setEdge('bottom'),
      dockLeft: () => setEdge('left'),
      dockNone: () => {
        setIsUndocking(true);
        setEdge('none');
      },
      dockRight: () => setEdge('right'),
      dockTop: () => setEdge('top')
    }
  ];
};
