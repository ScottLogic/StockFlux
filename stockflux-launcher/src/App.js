import React from 'react';
import cx from 'classnames';
import 'stockflux-components';
import { WindowHooks, Constants } from 'openfin-react-hooks';
import {
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import AppShortcuts from './app-shortcuts/AppShortcuts';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import ToolBar from './toolbar/ToolBar';
import CloseButton from './toolbar/CloseButton';
import './App.css';

export default () => {
  const [edge, windowActions] = WindowHooks.useDockWindow(Constants.ScreenEdge.TOP, window.fin.Window.getCurrentSync(),
      true, { dockedWidth: 50, dockedHeight: 50 });

  return (
    <div className={cx('app', edge)}>
      {(edge === Constants.ScreenEdge.LEFT || edge === Constants.ScreenEdge.RIGHT) && CloseButton}
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
          }
        ]}
      />
      {(edge === Constants.ScreenEdge.TOP || edge === Constants.ScreenEdge.NONE) && CloseButton}
    </div>
  );
};
