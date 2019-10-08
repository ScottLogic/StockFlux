import React, { useEffect, useCallback, useRef, useState } from 'react';
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
  const [isCloudMode, setCloudMode] = useState(false);
  const [isDocked, setDocked] = useState(true);
  const [isHorizontal, setHorizontal] = useState(true);
  const [options] = useOptions();
  const [edge, windowActions] = useDockWindow(
    ScreenEdge.TOP,
    OpenfinApiHelpers.getCurrentWindowSync(),
    true,
    { dockedWidth: 50, dockedHeight: 50 }
  );

  const prevEdgeRef = useRef();
  useEffect(() => {
    prevEdgeRef.current = edge;
  });
  const prevEdge = prevEdgeRef.current;

  const edgeToBeChecked = edge === ScreenEdge.NONE ? prevEdge : edge;

  useEffect(() => {
    setCloudMode(
      options && options.customData && options.customData.cloudMode === true
    );
    setDocked(!isCloudMode && edge !== ScreenEdge.NONE);
    setHorizontal(
      isCloudMode || [ScreenEdge.TOP, ScreenEdge.NONE].indexOf(edge) > -1
    );
  }, [edge, isCloudMode, isDocked, isHorizontal, options]);

  const undock = useCallback(() => {
    const w = OpenfinApiHelpers.getCurrentWindowSync();
    console.log(window);
    window.resizeTo(250, 250);
    //OpenfinApiHelpers.resizeWindow(100);
    //console.log(w);
  }, []);

  return (
    <div className={cx('app', edgeToBeChecked)}>
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
            onClick: undock,
            visible: !isCloudMode && isDocked
          },
          {
            label: <FaRegHandRock />,
            className: 'drag-handle',
            visible: !isDocked
          }
        ]}
      />
      {isHorizontal && CloseButton}
    </div>
  );
};
