import cx from 'classnames';
import React, { useCallback } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import './Titlebar.css';

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
        <div
          className="button-icon minimize"
          onClick={onMinimizeClick}
          title="Minimize"
        >
          &nbsp;
        </div>

        <div className="button-icon close" onClick={onCloseClick} title="Close">
          &nbsp;
        </div>
      </div>
    </div>
  );
};
