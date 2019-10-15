import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useDockWindow, useOptions, ScreenEdge } from 'openfin-react-hooks';
import {
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaRegHandRock,
  FaUnlock
} from 'react-icons/fa';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import ToolBar from './toolbar/ToolBar';
import CloseButton from './toolbar/CloseButton';
import './App.css';

export default () => {
  const [alignment, setAlignment] = useState('horizontal');
  const [isCloudMode, setCloudMode] = useState(false);
  const [isDocked, setDocked] = useState(true);
  const [options] = useOptions();
  const [undockWidth, setUndockWidth] = useState(1000);
  const [undockHeight, setUndockHeight] = useState(50);
  const [undockTop] = useState(50);
  const [undockLeft, setUndockLeft] = useState(0);

  const [edge, windowActions] = useDockWindow(
    ScreenEdge.TOP,
    window.fin.Window.getCurrentSync(),
    true,
    { dockedWidth: 50, dockedHeight: 50 },
    {
      undockPosition: { top: undockTop, left: undockLeft },
      undockSize: { width: undockWidth, height: undockHeight }
    }
  );

  let currentDirection = edge !== ScreenEdge.NONE ? edge : ScreenEdge.TOP;
  let left =
    window.screenLeft >= window.screen.availWidth ? window.screenLeft : 0;
  let right =
    window.screenLeft >= window.screen.availWidth
      ? window.screenLeft
      : window.screen.availWidth - 50;
  let midpoint =
    left === 0
      ? (left + right) / 4
      : window.screen.availWidth + (left + right) / 8;

  // Handle initialDocked false resize to mini window
  useEffect(() => {
    if (
      options &&
      options.customData &&
      options.customData.initialDocked === false
    ) {
      setUndockLeft(midpoint);
      windowActions.dockNone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (edge !== ScreenEdge.NONE) {
      setAlignment(edge !== ScreenEdge.TOP ? 'vertical' : 'horizontal');
    }
  }, [edge]);

  useEffect(() => {
    setCloudMode(
      options && options.customData && options.customData.cloudMode === true
    );
  }, [options, setCloudMode]);

  useEffect(() => {
    setDocked(!isCloudMode && edge !== ScreenEdge.NONE);
  }, [edge, isCloudMode]);

  const undock = async () => {
    switch (currentDirection) {
      case ScreenEdge.LEFT:
        setUndockHeight(600);
        setUndockWidth(50);
        setUndockLeft(left);
        break;
      case ScreenEdge.RIGHT:
        setUndockHeight(600);
        setUndockWidth(50);
        setUndockLeft(right);
        break;
      case ScreenEdge.TOP:
        setUndockHeight(50);
        setUndockWidth(1000);
        setUndockLeft(midpoint);
        break;
      default:
        break;
    }

    windowActions.dockNone();
  };

  return (
    <div className={cx('app', alignment, edge)}>
      {alignment === 'vertical' && CloseButton}
      <FreeTextSearch dockedTo={edge} />
      <ToolBar
        tools={[
          {
            label: <FaChevronUp />,
            onClick: windowActions.dockTop,
            disabled: edge === ScreenEdge.TOP,
            visible: !isCloudMode
          },
          {
            label: <FaChevronLeft />,
            onClick: windowActions.dockLeft,
            disabled: edge === ScreenEdge.LEFT,
            visible: !isCloudMode
          },
          {
            label: <FaChevronRight />,
            onClick: windowActions.dockRight,
            disabled: edge === ScreenEdge.RIGHT,
            visible: !isCloudMode
          },
          {
            label: <FaUnlock />,
            className: '',
            onClick: undock,
            disabled: false,
            visible: !isCloudMode && isDocked
          },
          {
            label: <FaRegHandRock />,
            className: 'drag-handle',
            disabled: isDocked,
            visible: !isCloudMode && !isDocked
          }
        ]}
      />
      {alignment === 'horizontal' && CloseButton}
    </div>
  );
};
