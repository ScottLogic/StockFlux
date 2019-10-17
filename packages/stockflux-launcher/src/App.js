import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { OpenfinApiHelpers } from 'stockflux-core';
import {
  useDocked,
  useDockWindow,
  useOptions,
  ScreenEdge
} from 'openfin-react-hooks';
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
  const [isDockable, setIsDockable] = useState(false);
  const [isDocked, setDocked] = useState(true);
  const [isHorizontal, setHorizontal] = useState(true);
  const [options] = useOptions();
  const [undockTop, setUndockTop] = useState(0);
  const [undockLeft, setUndockLeft] = useState(0);

  const [edge, windowActions] = useDockWindow(
    ScreenEdge.TOP,
    OpenfinApiHelpers.getCurrentWindowSync(),
    true,
    { dockedWidth: 50, dockedHeight: 50 },
    {
      undockPosition: { top: undockTop, left: undockLeft },
      undockSize: { width: 1000, height: 50 }
    }
  );

  const hasAttachedWindow = useDocked()[0];

  // Update location
  useEffect(() => {
    let left = setUndockPosition(
      0,
      window.screen.availWidth,
      window.screenLeft
    );
    let top = setUndockPosition(
      0,
      window.screen.availHeight,
      window.screenTop,
      true
    );
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
      windowActions.dockNone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    setHorizontal(
      edge === ScreenEdge.TOP || edge === ScreenEdge.NONE ? true : false
    );
  }, [edge]);

  useEffect(() => {
    setIsDockable(
      options && options.customData && options.customData.isDockable === true
    );
  }, [options, setIsDockable]);

  useEffect(() => {
    setDocked(isDockable && edge !== ScreenEdge.NONE);
  }, [edge, isDockable]);

  const setUndockPosition = (
    position,
    availValue,
    screenValue,
    isTop = false
  ) => {
    position = screenValue < 0 ? -availValue : position;
    position = screenValue >= availValue ? availValue : position;

    // Offset undocked top to account for OpenFin Cloud wrapper at top of screen
    if (isTop) {
      position = position + 100;
    }
    return position;
  };

  return (
    <div className={cx('app', edge)}>
      {!isHorizontal && CloseButton}
      <FreeTextSearch dockedTo={edge} />
      <ToolBar
        tools={[
          {
            label: <FaChevronUp />,
            onClick: windowActions.dockTop,
            disabled: edge === ScreenEdge.TOP || hasAttachedWindow,
            visible: isDockable
          },
          {
            label: <FaChevronLeft />,
            onClick: windowActions.dockLeft,
            disabled: edge === ScreenEdge.LEFT || hasAttachedWindow,
            visible: isDockable
          },
          {
            label: <FaChevronRight />,
            onClick: windowActions.dockRight,
            disabled: edge === ScreenEdge.RIGHT || hasAttachedWindow,
            visible: isDockable
          },
          {
            label: <FaUnlock />,
            className: '',
            onClick: windowActions.dockNone,
            disabled: hasAttachedWindow,
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
      {isHorizontal && CloseButton}
    </div>
  );
};
