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
import AppShortcuts from './AppShortcuts';
import FreeTextSearch from './free-text-search/FreeTextSearch';
import ToolBar from './ToolBar';
import './App.css';

export default () => {
  const [windowState, windowActions] = WindowHooks.useCurrentWindowState();

  return (
    <div className={cx('app', windowState.edge)}>
      <AppShortcuts />
      <FreeTextSearch dockedTo={windowState.edge} />
      <ToolBar
        tools={[
          {
            label: <FaCog />
          },
          {
            label: <FaChevronUp />,
            onClick: () => {
              windowActions.lockTop();
            },
            disabled: () => windowState.edge === Constants.ScreenEdge.TOP
          },
          {
            label: <FaChevronLeft />,
            onClick: () => {
              windowActions.lockLeft();
            },
            disabled: () => windowState.edge === Constants.ScreenEdge.LEFT
          },
          {
            label: <FaChevronRight />,
            onClick: () => {
              windowActions.lockRight();
            },
            disabled: () => windowState.edge === Constants.ScreenEdge.RIGHT
          }
        ]}
      />
    </div>
  );
};
