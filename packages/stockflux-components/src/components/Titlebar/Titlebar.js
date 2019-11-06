import React, { useCallback } from 'react';
import { useDocked } from 'openfin-react-hooks';
import { snapAndDock } from 'openfin-layouts';
import { OpenfinApiHelpers } from 'stockflux-core';
import CloseIcon from '../icons/close.svg';
import MinimizeIcon from '../icons/minimize.svg';
import LinkIcon from '../icons/link.svg';
import ConfirmationWindow from '../popups/ConfirmationWindow';

import './Titlebar.css';

export default ({ title, confirmClose }) => {
  const isDocked = useDocked();

  const onMinimizeClick = useCallback(async () => {
    const currentWindow = await OpenfinApiHelpers.getCurrentWindow();
    currentWindow.minimize();
  }, []);

  const onCloseClick = useCallback(async () => {
    const currentWindow = await OpenfinApiHelpers.getCurrentWindow();
    currentWindow.close();
  }, []);

  const onUndockClick = useCallback(async () => {
    await snapAndDock.undockWindow();
  }, []);

  return (
    <div className="titlebar-container">
      <div className="title-container">
        <span>{title}</span>
      </div>
      <div className="icons-container">
        {isDocked[0] && (
          <div
            className="header-icon link-icon"
            onClick={onUndockClick}
            title="Undock"
          >
            <LinkIcon />
          </div>
        )}
        <div className="header-icon" onClick={onMinimizeClick} title="Minimize">
          <MinimizeIcon />
        </div>
        {!confirmClose && (
          <div className="header-icon" onClick={onCloseClick} title="Close">
            <CloseIcon />
          </div>
        )}
        {confirmClose && (
          <div>
            <ConfirmationWindow
              message="This will close all related windows. Do you wish to continue?"
              onConfirm={onCloseClick}
            >
              <div className="header-icon">
                <CloseIcon />
              </div>
            </ConfirmationWindow>
          </div>
        )}
      </div>
    </div>
  );
};
