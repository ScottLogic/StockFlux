import cx from 'classnames';
import { ScreenEdge, useDockWindow, useOptions } from 'openfin-react-hooks';
import React, { useEffect, useState } from 'react';
import Components from 'stockflux-components';
import { OpenfinApiHelpers } from 'stockflux-core';
import './App.css';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import getUndockedPosition from './helpers/getUndockedPosition';
import AppShortcut from './app-shortcuts/AppShortcuts';

import DockSelector from './dock-selector/DockSelector';

export default () => {
  const [options] = useOptions();
  const defaultHeight = options ? options.defaultHeight : 90;
  const defaultWidth = options ? options.defaultWidth : 60;
  const isDockable = options ? options.customData.isDockable : false;
  const [undockPosition, setUndockPosition] = useState({ left: 0, top: 0 });
  const [isHorizontal, setHorizontal] = useState(true);
  const [edge, windowActions] = useDockWindow(
    ScreenEdge.TOP,
    OpenfinApiHelpers.getCurrentWindowSync(),
    true,
    {
      dockedWidth: isHorizontal ? defaultWidth : 68,
      dockedHeight: defaultHeight
    },
    {
      undockPosition: { left: undockPosition.left, top: undockPosition.top },
      undockSize: { width: 993, height: 90 }
    }
  );

  const iconStyle = `icon ${isHorizontal ? 'horizontal' : 'vertical'}`;
  // const toolbarStyle = isHorizontal ? 'toolbar' : 'toolbar t-vertical';
  const title = isHorizontal ? (
    <span>
      <span className="title strong">Stock</span>
      <span className="title">Flux</span>
    </span>
  ) : (
    ''
  );

  /* Hook undock if initialDocked is false on start */
  useEffect(() => {
    if (
      options &&
      options.customData &&
      options.customData.initialDocked === false
    ) {
      windowActions.dockNone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  /* Make sure window shrinks when dragged from top */
  useEffect(() => {
    if (edge === ScreenEdge.NONE) {
      getUndockedPosition().then(position => {
        setUndockPosition({ left: position.left, top: position.top });

        windowActions.dockNone();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edge]);

  useEffect(() => {
    setHorizontal([ScreenEdge.TOP, ScreenEdge.NONE].includes(edge));
  }, [edge]);

  return (
    <div className="launcher">
      <div className="titlebar">
        <Components.Titlebar title={title} confirmClose={true} />
      </div>
      <div className={cx('app', edge)}>
        {!isHorizontal && (
          <div className="title title-vertical">
            <span className="title strong">S</span>
            <span className="title">F</span>
          </div>
        )}
        <div className={iconStyle}>
          <AppShortcut small={true} showTitle={isHorizontal} />
        </div>

        {isHorizontal && <FreeTextSearch dockedTo={edge} />}

        <DockSelector
          dockedTo={edge}
          iconStyle={iconStyle}
          tools={[
            {
              className: 'icon',
              label: <Components.Icons.Launcher.LeftIcon />,
              description: 'Left',
              onClick: windowActions.dockLeft,
              disabled: edge === ScreenEdge.LEFT,
              visible: isDockable
            },
            {
              className: 'icon',
              label: <Components.Icons.Launcher.TopIcon />,
              description: 'Top',
              onClick: windowActions.dockTop,
              disabled: edge === ScreenEdge.TOP,
              default: true,
              visible: isDockable
            },
            {
              className: 'icon',
              label: <Components.Icons.Launcher.RightIcon />,
              description: 'Right',
              onClick: windowActions.dockRight,
              disabled: edge === ScreenEdge.RIGHT,
              visible: isDockable
            }
          ]}
        />
        {!isHorizontal && <FreeTextSearch dockedTo={edge} />}
      </div>
    </div>
  );
};
