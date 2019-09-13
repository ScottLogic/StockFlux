import React, { useRef, useEffect } from 'react';
import cx from 'classnames';
import { OpenfinApiHelpers } from 'stockflux-core';
import { useDockWindow, ScreenEdge } from 'openfin-react-hooks';
import {
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaRegHandRock
} from 'react-icons/fa';
import AppShortcuts from './app-shortcuts/AppShortcuts';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import ToolBar from './toolbar/ToolBar';
import CloseButton from './toolbar/CloseButton';
import './App.css';

const isLauncherHorizontal = edge => edge === ScreenEdge.TOP;

export default () => {
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

  return (
    <div className={cx('app', edgeToBeChecked)}>
      {!isLauncherHorizontal(edgeToBeChecked) && CloseButton}
      <AppShortcuts />
      <FreeTextSearch dockedTo={edge} />
      <ToolBar
        tools={[
          {
            label: <FaChevronUp />,
            onClick: windowActions.dockTop,
            disabled: edge === ScreenEdge.TOP
          },
          {
            label: <FaChevronLeft />,
            onClick: windowActions.dockLeft,
            disabled: edge === ScreenEdge.LEFT
          },
          {
            label: <FaChevronRight />,
            onClick: windowActions.dockRight,
            disabled: edge === ScreenEdge.RIGHT
          },
          {
            label: <FaRegHandRock />,
            className: 'drag-handle'
          }
        ]}
      />
      {isLauncherHorizontal(edgeToBeChecked) && CloseButton}
    </div>
  );
};
