import cx from 'classnames';
import { ScreenEdge, useDockWindow, useOptions } from 'openfin-react-hooks';
import React, { useEffect, useState } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import './App.css';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import getUndockedPosition from './helpers/getUndockedPosition';
import { ReactComponent as LeftIcon } from './icons/left.svg';
import { ReactComponent as RightIcon } from './icons/right.svg';
import { ReactComponent as TopIcon } from './icons/top.svg';
import Watchlist from './app-shortcuts/Watchlist';
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

  const iconStyle = isHorizontal ? 'icon horizontal' : 'icon vertical';
  const toolbarStyle = isHorizontal ? 'toolbar' : 'toolbar t-vertical';

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
        setLeft(position.left);
        setTop(position.top);

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
        <div className={iconStyle}>
          <Watchlist symbol="TSLA" name="Tesla" />
        </div>

        <FreeTextSearch dockedTo={edge} />

        <ToolBar
          style={toolbarStyle}
          tools={[
            {
              className: 'icon',
              label: <LeftIcon />,
              onClick: windowActions.dockLeft,
              disabled: edge === ScreenEdge.LEFT,
              visible: isDockable
            },
            {
              className: 'icon',
              label: <TopIcon />,
              onClick: windowActions.dockTop,
              disabled: edge === ScreenEdge.TOP,
              visible: isDockable
            },
            {
              className: 'icon',
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
