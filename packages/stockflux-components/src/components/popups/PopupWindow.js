import React, { useState, useEffect, useCallback } from 'react';
import DialogButton from '../buttons/dialog-button/DialogButton';
import { useChildWindow } from 'openfin-react-hooks';
import getUndockedPosition from './getUndockedPosition';

const windowSize = { height: 145, width: 270 };

const PopupWindow = ({ message, options, children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const handleClick = () => {
    setShowPopup(true);
  };

  const childWindow = useChildWindow({
    name: 'popup-window',
    parentDocument: document,
    cssUrl: 'popupWindow.css',
    shouldClosePreviousOnLaunch: true,
    shouldInheritCss: true
  });

  const launchChildWindow = useCallback(() => {
    getUndockedPosition({ windowSize }).then(position => {
      childWindow.launch({
        name: 'popup-window',
        url: 'child-window.html',
        frame: false,
        autoShow: true,
        defaultTop: position.top,
        defaultLeft: position.left,
        saveWindowState: false,
        showTaskbarIcon: false,
        resizable: false,
        waitForPageLoad: true,
        alwaysOnTop: true,
        defaultWidth: windowSize.width,
        defaultHeight: windowSize.height
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelection = useCallback(
    status => {
      setShowPopup(false);
      const action = options.find(x => x.name === status);
      if (action.action) {
        action.action();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setShowPopup]
  );

  useEffect(() => {
    if (childWindow.state === 'LAUNCHED') {
      const childWindowJsx = (
        <div className="popup">
          <p className="popup-message">{message}</p>
          <div className="popup-options">
            {options.map(option => (
              <DialogButton
                key={option.name}
                onClick={() => handleSelection(option.name)}
                className={option.className}
              >
                {option.icon}
              </DialogButton>
            ))}
          </div>
        </div>
      );
      childWindow.populate(childWindowJsx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childWindow.state, handleSelection]);

  useEffect(() => {
    showPopup ? launchChildWindow() : childWindow.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup, launchChildWindow]);

  return <div onClick={handleClick}>{children}</div>;
};

export default PopupWindow;
