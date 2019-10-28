import cx from 'classnames';
import React, { useCallback } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import './Titlebar.css';
import { ReactComponent as CloseIcon } from '../icons/close.svg';
import { ReactComponent as MinimizeIcon } from '../icons/minimize.svg';

export default ({ dockedTo }) => {
  const onMinimizeClick = useCallback(async () => {
    const currentWindow = await OpenfinApiHelpers.getCurrentWindow();
    currentWindow.minimize();
  }, []);

  const onCloseClick = useCallback(async () => {
    const currentWindow = await OpenfinApiHelpers.getCurrentWindow();
    currentWindow.close();
  }, []);

  let heading;
  if (dockedTo === 'top' || dockedTo === 'none') {
    heading = (
      <p className="title">
        <strong>Stock</strong>Flux
      </p>
    );
  } else {
    heading = (
      <p className="title">
        <strong>SF</strong>
      </p>
    );
  }

  return (
    <div className="titlebar">
      <div
        className={cx(
          'column column-left',
          dockedTo === 'top' || dockedTo === 'none' ? 'add-padding-left' : ''
        )}
      >
        {heading}
      </div>
      <div
        className={cx(
          'column column-right',
          dockedTo === 'top' || dockedTo === 'none' ? 'add-padding-right' : ''
        )}
      >
        <div className="header-icon" onClick={onMinimizeClick} title="Minimize">
          <MinimizeIcon />
        </div>

        <div className="header-icon" onClick={onCloseClick} title="Close">
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};
