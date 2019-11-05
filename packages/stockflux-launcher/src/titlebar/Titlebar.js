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

  const ButtonComponent = (closeButton, onClick, title) => {
    return (
      <div
        className={cx(
          'column column-right header-icon',
          dockedHorizontal ? 'add-padding-right' : ''
        )}
        onClick={onClick}
        title={title}
      >
        {closeButton && <Components.Icons.Toolbar.CloseIcon />}
        {!closeButton && <Components.Icons.Toolbar.MinimizeIcon />}
      </div>
    );
  };

  return (
    <div className="titlebar">
      {dockedHorizontal && (
        <div
          className={cx(
            'column column-left',
            dockedHorizontal ? 'add-padding-left' : ''
          )}
        >
          <p className="title">
            <span className="title-strong">Stock</span>
            <span className="title-light">Flux</span>
          </p>
        </div>
      )}

      {ButtonComponent(true, onCloseClick, 'Close')}

      {ButtonComponent(false, onMinimizeClick, 'Minimize')}

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
