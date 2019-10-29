import cx from 'classnames';
import { ScreenEdge, useDockWindow, useOptions } from 'openfin-react-hooks';
import React, { useEffect, useState } from 'react';
import Components from 'stockflux-components';
import { OpenfinApiHelpers } from 'stockflux-core';
import './App.css';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import { ReactComponent as LeftIcon } from './icons/left.svg';
import { ReactComponent as RightIcon } from './icons/right.svg';
import { ReactComponent as TopIcon } from './icons/top.svg';
import Titlebar from './titlebar/Titlebar';
import ToolBar from './toolbar/ToolBar';

export default () => {
  const [options] = useOptions();
  const defaultHeight = options ? options.defaultHeight : 75;
  const defaultWidth = options ? options.defaultWidth : 50;
  const isDockable = options ? options.customData.isDockable : false;
  const [leftPosition, setLeft] = useState(0);
  const [topPosition, setTop] = useState(0);
  const [isHorizontal, setHorizontal] = useState(true);
  const [edge, windowActions] = useDockWindow(
    ScreenEdge.TOP,
    OpenfinApiHelpers.getCurrentWindowSync(),
    true,
    {
      dockedWidth: isHorizontal ? defaultWidth : 80,
      dockedHeight: defaultHeight
    },
    {
      undockPosition: { left: leftPosition, top: topPosition },
      undockSize: { width: 724, height: 88 }
    }
  );

  async function getBounds() {
    let bounds = await OpenfinApiHelpers.getCurrentWindowSync().getBounds();
    return bounds;
  }

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
      getBounds().then(value => {
        setLeft(value.left);
        setTop(value.top);

        windowActions.dockNone();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edge]);

  useEffect(() => {
    setHorizontal(
      edge === ScreenEdge.TOP || edge === ScreenEdge.NONE ? true : false
    );
  }, [edge]);

  return (
    <div className="launcher-container">
      <div className="launcher-title">
        <Titlebar dockedTo={edge} />
      </div>
      <div className={cx('app', edge)}>
        <div
          className={cx(
            'launcher-icon',
            edge === 'top' || edge === 'none'
              ? 'shortcut-horizontal'
              : 'shortcut-vertical'
          )}
        >
          <Components.Shortcuts.Watchlist symbol="TSLA" name="Tesla" />
        </div>

        <FreeTextSearch dockedTo={edge} />
        <ToolBar
          tools={[
            {
              className:
                edge === ScreenEdge.LEFT
                  ? 'launcher-icon-active'
                  : 'launcher-icon',
              label: <LeftIcon />,
              onClick: windowActions.dockLeft,
              disabled: edge === ScreenEdge.LEFT,
              visible: isDockable
            },
            {
              className:
                edge === ScreenEdge.TOP
                  ? 'launcher-icon-active'
                  : 'launcher-icon',
              label: <TopIcon />,
              onClick: windowActions.dockTop,
              disabled: edge === ScreenEdge.TOP,
              visible: isDockable
            },
            {
              className:
                edge === ScreenEdge.RIGHT
                  ? 'launcher-icon-active'
                  : 'launcher-icon',
              label: <RightIcon />,
              onClick: windowActions.dockRight,
              disabled: edge === ScreenEdge.RIGHT,
              visible: isDockable
            }
          ]}
        />
      </div>
    </div>
  );
};
