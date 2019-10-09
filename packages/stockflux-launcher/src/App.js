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
    if (!isCloudMode) {
      if (edge !== ScreenEdge.NONE) {
        setHorizontal(edge === ScreenEdge.TOP);
      }
    } else {
      setHorizontal(true);
    }

    prevEdgeRef.current = edge;
  }, [edge, isCloudMode]);

  const prevEdge = prevEdgeRef.current;

  const edgeToBeChecked = edge === ScreenEdge.NONE ? prevEdge : edge;

  useEffect(() => {
    setCloudMode(
      options && options.customData && options.customData.cloudMode === true
    );
  }, [options, setCloudMode]);

  useEffect(() => {
    setDocked(!isCloudMode && edge !== ScreenEdge.NONE);
  }, [edge, isCloudMode]);

  const undock = async () => {
    //windowActions.dockNone();
    const w = OpenfinApiHelpers.getCurrentWindowSync();
    await w.animate({
      position: {
        left: 100,
        top: 100,
        duration: 250
      },
      size: {
        duration: 250,
        width: 600,
        height: 70
      }
    });
    //setDocked(false);
  };

  return (
    <div className={cx('app', edgeToBeChecked)}>
      {!isHorizontal && CloseButton}
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
            label: <FaRegHandRock />,
            className: 'drag-handle',
            visible: isDocked
          },
          {
            label: <FaUnlock />,
            onClick: undock,
            disabled: false,
            visible: !isCloudMode && isDocked
          }
        ]}
      />
      {isHorizontal && CloseButton}
    </div>
  );
};
