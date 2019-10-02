import React, { useState, useEffect, useCallback } from 'react';
import Components from 'stockflux-components';
import useChildWindow from '../search-results/helpers/useChildWindow';

const ModalPopup = ({ message, options, children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const handleClick = () => {
    setShowPopup(true);
  };
  const childWindow = useChildWindow('popup', document, 'popupWindow.css');

  const launchChildWindow = useCallback(() => {
    childWindow.launch({
      name: 'popup-confirmation',
      url: 'child-window.html',
      frame: false,
      autoShow: true,
      defaultCenter: true,
      saveWindowState: false,
      showTaskbarIcon: true,
      backgroundColor: '#28313D',
      waitForPageLoad: true,
      alwaysOnTop: true,
      maxWidth: 400,
      minWidth: 400,
      minHeight: 200,
      maxHeight: 200
    });
  }, []);

  const handleSelection = useCallback(
    status => {
      setShowPopup(false);
      const action = options.find(x => x.name === status);
      if (action.action) {
        action.action();
      }
    },
    [setShowPopup]
  );

  useEffect(() => {
    if (childWindow.window) {
      const childWindowJsx = (
        <>
          <div className="popup">
            <p className="popup-message">{message}</p>
            <div className="popup-options">
              {options.map(option => {
                return (
                  <Components.Buttons.Round
                    key={option.name}
                    onClick={() => handleSelection(option.name)}
                    className={option.className}
                  >
                    {option.icon}
                  </Components.Buttons.Round>
                );
              })}
            </div>
          </div>
        </>
      );
      childWindow.populateDOM(childWindowJsx);
    }
  }, [childWindow, handleSelection]);

  useEffect(() => {
    if (showPopup) {
      launchChildWindow();
    } else {
      childWindow.close();
    }
  }, [showPopup, launchChildWindow]);

  return <div onClick={handleClick}>{children}</div>;
};

export default ModalPopup;
