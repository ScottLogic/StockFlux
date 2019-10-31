import cx from 'classnames';
import { ScreenEdge } from 'openfin-react-hooks';
import React, { useCallback } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import Components from 'stockflux-components';
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

  const dockedHorizontal = [ScreenEdge.NONE, ScreenEdge.TOP].includes(dockedTo);

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
            <span className="title-strong">Stock</span>
            <span className="title-light">Flux</span>
          </p>
        </div>
      )}

      <div
        className={cx(
          'column column-right header-icon',
          dockedHorizontal ? 'add-padding-right' : ''
        )}
        onClick={onCloseClick}
        title="Close"
      >
        <Components.Icons.Toolbar.CloseIcon />
      </div>

      <div
        className={cx(
          'column column-right header-icon',
          dockedHorizontal ? 'add-padding-right' : ''
        )}
        onClick={onMinimizeClick}
        title="Minimize"
      >
        <Components.Icons.Toolbar.MinimizeIcon />
      </div>

      {!dockedHorizontal && (
        <div>
          <p className="title title-vertical">
            <span className="title-strong">S</span>
            <span className="title-light">F</span>
          </p>
        </div>
      )}
    </div>
  );
};
