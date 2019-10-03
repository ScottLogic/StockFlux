import React, { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import { OpenfinApiHelpers } from 'stockflux-core';
import { useDockWindow, ScreenEdge, useOptions } from 'openfin-react-hooks';
import {
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaRegHandRock,
  FaUnlock
} from 'react-icons/fa';
import AppShortcuts from './app-shortcuts/AppShortcuts';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import ToolBar from './toolbar/ToolBar';
import CloseButton from './toolbar/CloseButton';
import './App.css';

export default () => {
  const [options] = useOptions();
  const [isHorizontal, setHorizontal] = useState(true);
  const [isCloudMode, setCloudMode] = useState(false);
  const [isDocked, setDocked] = useState(true);

  const [edge, windowActions] = useDockWindow(
    ScreenEdge.TOP,
    OpenfinApiHelpers.getCurrentWindowSync(),
    true,
    { dockedWidth: 50, dockedHeight: 50 }
  );

  useEffect(() => {
    setCloudMode(
      options && options.customData && options.customData.cloud === true
    );
  }, [options, windowActions]);

  // When the edge changes i.e. when the launcher is docked (or docked to a
  // different side of the screen) or undocked, then we can set the isHorizontal
  // state item to reflect.
  useEffect(() => {
    setDocked(!isCloudMode && edge !== ScreenEdge.NONE);
    setHorizontal(
      isCloudMode || [ScreenEdge.TOP, ScreenEdge.NONE].indexOf(edge) > -1
    );
  }, [edge, setHorizontal, isCloudMode]);

  const undock = useCallback(() => {
    // const { defaultWidth, defaultHeight } = options;
    windowActions.dockNone();
    // const w = OpenfinApiHelpers.getCurrentWindowSync();

    // console.log('Moving...', defaultWidth, defaultHeight, w);
    // w.animate({
    //   size: {
    //     duration: 250,
    //     width: defaultWidth,
    //     height: defaultHeight
    //   }
    // });
  }, [windowActions]);

  useEffect(() => console.log(options), [options]);

  return (
    <div className={cx('app', edge)}>
      {!isHorizontal && CloseButton}
      {!isCloudMode && <AppShortcuts />}
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
            visible: !isDocked
          },
          {
            label: <FaUnlock />,
            onClick: undock,
            visible: !isCloudMode && isDocked
          }
        ]}
      />
      {isHorizontal && CloseButton}
    </div>
  );
};

// const isLauncherHorizontal = edge => edge === ScreenEdge.TOP;

// export default () => {
//   const [edge, windowActions] = useDockWindow(
//     ScreenEdge.TOP,
//     OpenfinApiHelpers.getCurrentWindowSync(),
//     true,
//     { dockedWidth: 50, dockedHeight: 50 }
//   );

//   const prevEdgeRef = useRef();
//   useEffect(() => {
//     prevEdgeRef.current = edge;
//   });
//   const prevEdge = prevEdgeRef.current;

//   const edgeToBeChecked = edge === ScreenEdge.NONE ? prevEdge : edge;

//   return (
//     <div className={cx('app', edgeToBeChecked)}>
//       {!isLauncherHorizontal(edgeToBeChecked) && CloseButton}
//       <AppShortcuts />
//       <FreeTextSearch dockedTo={edge} />
//       <ToolBar
//         tools={[
//           {
//             label: <FaChevronUp />,
//             onClick: windowActions.dockTop,
//             disabled: edge === ScreenEdge.TOP
//           },
//           {
//             label: <FaChevronLeft />,
//             onClick: windowActions.dockLeft,
//             disabled: edge === ScreenEdge.LEFT
//           },
//           {
//             label: <FaChevronRight />,
//             onClick: windowActions.dockRight,
//             disabled: edge === ScreenEdge.RIGHT
//           },
//           {
//             label: <FaRegHandRock />,
//             className: 'drag-handle'
//           }
//         ]}
//       />
//       {isLauncherHorizontal(edgeToBeChecked) && CloseButton}
//     </div>
//   );
// };
