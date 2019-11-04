import React, { useState, useCallback, useEffect } from 'react';
import { useChildWindow } from 'openfin-react-hooks';

export default ({
  windowName,
  htmlPath,
  cssPath,
  children,
  position = { left: 100, top: 100 },
  size = { width: 300, height: 300 },
  display
}) => {
  const windowStatus = {
    showing: 'SHOWING',
    hiding: 'HIDING',
    hide: 'HIDE',
    hidden: 'HIDDEN'
  };

  const WINDOW_OPTIONS = {
    name: windowName,
    waitForPageLoad: true,
    opacity: 0.0,
    autoShow: false,
    showTaskbarIcon: false,
    defaultHeight: size.height,
    defaultWidth: size.width,
    url: htmlPath,
    frame: false,
    resizable: false,
    alwaysOnTop: true
  };

  const childWindow = useChildWindow({
    name: windowName,
    options: WINDOW_OPTIONS,
    shouldInheritCss: true,
    parentDocument: document,
    cssUrl: cssPath,
    shouldClosePreviousOnLaunch: true
  });

  const { windowRef, launch } = childWindow;

  const launchChildWindow = useCallback(
    () => launch(WINDOW_OPTIONS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [launch]
  );

  const [popupStatus, setPopupStatus] = useState(windowStatus.hidden);

  const showWindow = () => {
    if (windowRef) {
      setPopupStatus(windowStatus.showing);
      windowRef.show().then(() => {
        windowRef.animate(
          { opacity: { opacity: 0.7, duration: 500 } },
          { tween: 'ease-in-out', interrupt: true }
        );
      });
    }
  };

  const hideWindow = () => {
    if (windowRef) {
      setPopupStatus(windowStatus.hiding);
      windowRef
        .animate(
          { opacity: { opacity: 0.0, duration: 500 } },
          { tween: 'ease-in-out', interrupt: true }
        )
        .then(() => setPopupStatus(windowStatus.hide));
    }
  };

  useEffect(() => {
    if (popupStatus === windowStatus.hide && display === false) {
      windowRef.hide();
      setPopupStatus(windowStatus.hidden);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupStatus, windowRef]);

  useEffect(() => {
    if (display) {
      !windowRef && launchChildWindow();
      showWindow();
    } else {
      hideWindow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, windowRef]);

  useEffect(() => {
    windowRef &&
      windowRef.moveTo(position.left, position.top, {
        moveindependently: true
      });
  }, [position, windowRef]);

  useEffect(() => {
    windowRef &&
      windowRef.resizeTo(size.width, size.height, 'top-left', {
        moveindependently: true
      });
  }, [size, windowRef]);

  return <>{children}</>;
};
