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

  useEffect(() => {
    setCloudMode(
      options && options.customData && options.customData.cloudMode === true
    );
    setDocked(!isCloudMode && edge !== ScreenEdge.NONE);
    setHorizontal(
      isCloudMode || [ScreenEdge.TOP, ScreenEdge.NONE].indexOf(edge) > -1
    );
  }, [edge, isCloudMode, setDocked, isHorizontal, options]);

  const undock = () => {
    console.log('here');
    const w = OpenfinApiHelpers.getCurrentWindowSync();
    w.animate({
      size: {
        duration: 250,
        width: 600,
        height: 70
      }
    });
    setDocked(false);
  };

  // const undock = useCallback(() => {
  //   const w = OpenfinApiHelpers.getCurrentWindowSync();
  //   w.animate({
  //     size: {
  //       duration: 250,
  //       width: 600,
  //       height: 70
  //     }
  //   });
  //   setDocked(false);
  // }, [setDocked]);

  return (
    <div className={cx('app', edge)}>
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
            disabled: false,
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
