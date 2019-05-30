import React from 'react';
import cx from 'classnames';
import 'stockflux-components';
import { WindowHooks, Constants } from 'openfin-react-hooks';
import {
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaCog
} from 'react-icons/fa';
import AppShortcuts from './app-shortcuts/AppShortcuts';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import ToolBar from './toolbar/ToolBar';
import CloseButton from './toolbar/CloseButton';
import './App.css';

export default () => {
  const [windowState, windowActions] = WindowHooks.useCurrentWindowState();

  return (
    <div className={cx('app', windowState.edge)}>
      {(windowState.edge === Constants.ScreenEdge.LEFT ||
        windowState.edge === Constants.ScreenEdge.RIGHT) &&
        CloseButton}
      <AppShortcuts />
      <FreeTextSearch dockedTo={windowState.edge} />
      <ToolBar
        tools={[
          {
            label: <FaCog />,
            onClick: () => {}
          },
          {
            label: <FaChevronUp />,
            onClick: () => {
              windowActions.lockTop();
            },
            disabled: windowState.edge === Constants.ScreenEdge.TOP
          },
          {
            label: <FaChevronLeft />,
            onClick: () => {
              windowActions.lockLeft();
            },
            disabled: windowState.edge === Constants.ScreenEdge.LEFT
          },
          {
            label: <FaChevronRight />,
            onClick: () => {
              windowActions.lockRight();
            },
            disabled: windowState.edge === Constants.ScreenEdge.RIGHT
          }
        ]}
      />
      {(windowState.edge === Constants.ScreenEdge.TOP ||
        windowState.edge === Constants.ScreenEdge.NONE) &&
        CloseButton}
    </div>
  );
};
