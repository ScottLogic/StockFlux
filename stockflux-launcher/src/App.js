import React, {useRef, useEffect} from 'react';
import cx from 'classnames';
import 'stockflux-components';
import { WindowHooks, Constants } from 'openfin-react-hooks';
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

const isLauncherHorizontal = (edge) => {
  return edge === Constants.ScreenEdge.TOP;
}

export default () => {
  const [edge, windowActions] = WindowHooks.useDockWindow(Constants.ScreenEdge.TOP, window.fin.Window.getCurrentSync(),
      true, { dockedWidth: 50, dockedHeight: 50 });

  const prevEdgeRef = useRef();
      useEffect(() => {
        prevEdgeRef.current = edge;
  });
  const prevEdge = prevEdgeRef.current;    

  return (
    <div className={cx('app', edge === Constants.ScreenEdge.NONE ? prevEdge : edge)} >
      {!isLauncherHorizontal(edge === Constants.ScreenEdge.NONE ? prevEdge : edge) && CloseButton}
      <AppShortcuts />
      <FreeTextSearch dockedTo={edge} />
      <ToolBar
        tools={[
          {
            label: <FaChevronUp />,
            onClick: windowActions.dockTop,
            disabled: edge === Constants.ScreenEdge.TOP
          },
          {
            label: <FaChevronLeft />,
            onClick: windowActions.dockLeft,
            disabled: edge === Constants.ScreenEdge.LEFT
          },
          {
            label: <FaChevronRight />,
            onClick: windowActions.dockRight,
            disabled: edge === Constants.ScreenEdge.RIGHT
          },
          {
            label: <FaRegHandRock />,
            className: 'drag-handle',
          }
        ]}
      />
      {isLauncherHorizontal(edge === Constants.ScreenEdge.NONE ? prevEdge : edge) && CloseButton}
    </div>
  );
};
