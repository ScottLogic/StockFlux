import React, { useEffect, useRef, useState } from 'react';
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
  const [direction, setDirection] = useState(ScreenEdge.TOP);
  const [isCloudMode, setCloudMode] = useState(false);
  const [isDocked, setDocked] = useState(true);
  const [options] = useOptions();
  const initialDocked = options ? options.customData.initialDocked : false;
  let currentScreenEdge =
    options && options.customData && options.customData.initialDocked === false
      ? ScreenEdge.NONE
      : ScreenEdge.TOP;
  const [edge, windowActions] = useDockWindow(
    currentScreenEdge,
    OpenfinApiHelpers.getCurrentWindowSync(),
    true,
    { dockedWidth: 50, dockedHeight: 50 }
  );

  const prevEdgeRef = useRef();
  useEffect(() => {
    if (edge !== ScreenEdge.NONE) prevEdgeRef.current = edge;
  });
  const prevEdge = prevEdgeRef.current;

  const edgeToBeChecked = edge === ScreenEdge.NONE ? prevEdge : edge;

  useEffect(() => {
    setCloudMode(
      options && options.customData && options.customData.cloudMode === true
    );
  }, [options, setCloudMode]);

  useEffect(() => {
    if (edge !== ScreenEdge.NONE) setDirection(edge);
  }, [edge]);

  useEffect(() => {
    setDocked(!isCloudMode && edgeToBeChecked !== ScreenEdge.NONE);
  }, [edge, edgeToBeChecked, isCloudMode]);

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
  }, [options, windowActions]);

  const undock = async () => {
    const w = OpenfinApiHelpers.getCurrentWindowSync();

    switch (direction) {
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
    <div className={cx('app', direction)}>
      {direction !== 'top' && CloseButton}
      <FreeTextSearch dockedTo={direction} />
      <p>direction: {direction}</p>
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
      {direction === 'top' && CloseButton}
    </div>
  );
};
