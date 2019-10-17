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
  const [isDockable, setIsDockable] = useState(false);
  const [isDocked, setDocked] = useState(true);
  const [options] = useOptions();
  const [undockWidth, setUndockWidth] = useState(1000);
  const [undockHeight, setUndockHeight] = useState(50);
  const [undockTop, setUndockTop] = useState(50);
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

  // Update location
  useEffect(() => {
    let left = 0;
    left = window.screenLeft < 0 ? -window.screen.availWidth : left;
    left =
      window.screenLeft >= window.screen.availWidth
        ? window.screen.availWidth
        : left;
    let top = 0;
    top = window.screenTop < 0 ? -window.screen.availHeight : top;
    top =
      window.screenTop >= window.screen.availHeight
        ? window.screen.availHeight + 50
        : top;
    setUndockLeft(left);
    setUndockTop(top);
  }, [edge]);

  // Handle initialDocked false resize to mini window
  useEffect(() => {
    if (
      options &&
      options.customData &&
      options.customData.initialDocked === false
    ) {
      undock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (edge !== ScreenEdge.NONE) {
      setAlignment(edge !== ScreenEdge.TOP ? 'vertical' : 'horizontal');
    }
  }, [edge]);

  useEffect(() => {
    setIsDockable(
      options && options.customData && options.customData.isDockable === true
    );
  }, [options, setIsDockable]);

  useEffect(() => {
    setDocked(isDockable && edge !== ScreenEdge.NONE);
  }, [edge, isDockable]);

  const undock = async () => {
    setUndockHeight(50);
    setUndockWidth(1000);
    windowActions.dockNone();
  };

  return (
    <div className={cx('app', currentDirection)}>
      {alignment === 'vertical' && CloseButton}
      <FreeTextSearch dockedTo={edge} />
      <ToolBar
        tools={[
          {
            label: <FaChevronUp />,
            onClick: windowActions.dockTop,
            disabled: edge === ScreenEdge.TOP,
            visible: isDockable
          },
          {
            label: <FaChevronLeft />,
            onClick: windowActions.dockLeft,
            disabled: edge === ScreenEdge.LEFT,
            visible: isDockable
          },
          {
            label: <FaChevronRight />,
            onClick: windowActions.dockRight,
            disabled: edge === ScreenEdge.RIGHT,
            visible: isDockable
          },
          {
            label: <FaUnlock />,
            className: '',
            onClick: undock,
            disabled: false,
            visible: isDockable && isDocked
          },
          {
            label: <FaRegHandRock />,
            className: 'drag-handle',
            disabled: isDocked,
            visible: !isDocked
          }
        ]}
      />
      {alignment === 'horizontal' && CloseButton}
    </div>
  );
};
