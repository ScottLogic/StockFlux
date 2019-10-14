import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { OpenfinApiHelpers } from 'stockflux-core';
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
  const initialEdge = options
    ? options.customData && options.customData.initialDocked === true
      ? ScreenEdge.TOP
      : ScreenEdge.NONE
    : ScreenEdge.TOP;
  const [edge, windowActions] = useDockWindow(
    initialEdge,
    OpenfinApiHelpers.getCurrentWindowSync(),
    true,
    { dockedWidth: 50, dockedHeight: 50 }
  );
  const currentDirection = edge !== ScreenEdge.NONE ? edge : ScreenEdge.TOP;

  // Handle initialDocked false resize to mini window
  useEffect(() => {
    if (
      options &&
      options.customData &&
      options.customData.initialDocked === false
    ) {
      const w = OpenfinApiHelpers.getCurrentWindowSync();
      w.resizeTo(600, 70);
      w.moveTo(600, 10);
    }
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
    const w = OpenfinApiHelpers.getCurrentWindowSync();

    switch (currentDirection) {
      case ScreenEdge.LEFT:
        w.resizeTo(50, 600);
        w.moveTo(20, 100);
        break;
      case ScreenEdge.RIGHT:
        w.resizeTo(50, 600);
        w.moveBy(-100, 100);
        break;
      case ScreenEdge.TOP:
        w.resizeTo(600, 70);
        w.moveBy(600, 10);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cx('app', alignment, edge)}>
      {alignment === 'vertical' && CloseButton}
      <FreeTextSearch dockedTo={currentDirection} />
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
            onClick: undock,
            disabled: isDocked,
            visible: !isCloudMode && !isDocked
          }
        ]}
      />
      {alignment === 'horizontal' && CloseButton}
    </div>
  );
};
