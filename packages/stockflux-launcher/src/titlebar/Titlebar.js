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

  const dockedHorizontal = dockedTo === 'top' || dockedTo === 'none';

  let heading;
  if (dockedHorizontal) {
    heading = (
      <p className="title">
        <strong>Stock</strong>Flux
      </p>
    );
  } else {
    // heading = (
    //   <p className="title">
    //     <strong>SF</strong>
    //   </p>
    // );
  }

  return (
    <div className="titlebar">
      {dockedHorizontal && (
        <div
          className={cx(
            'column column-left',
            dockedTo === 'top' || dockedTo === 'none' ? 'add-padding-left' : ''
          )}
        >
          <p className="title">
            <strong>Stock</strong>Flux
          </p>
        </div>
      )}

      <div
        className={cx(
          'column column-right',
          dockedTo === 'top' || dockedTo === 'none'
            ? 'header-icon add-padding-right'
            : 'header-icon'
        )}
        onClick={onCloseClick}
        title="Close"
      >
        <CloseIcon />
      </div>

      <div
        className={cx(
          'column column-right',
          dockedTo === 'top' || dockedTo === 'none'
            ? 'header-icon add-padding-right'
            : 'header-icon'
        )}
        onClick={onMinimizeClick}
        title="Minimize"
      >
        <MinimizeIcon />
      </div>

      {!dockedHorizontal && (
        <div>
          <p className="title title-vertical">
            <strong>SF</strong>
          </p>
        </div>
      )}
    </div>
  );
};
