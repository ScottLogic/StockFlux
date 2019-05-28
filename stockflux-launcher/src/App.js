import React, { useState } from 'react';
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
import DOCK_POSITION from './DockPosition';
import './App.css';

export default () => {
  const [windowState, windowActions] = WindowHooks.useCurrentWindowState();
  const [dockedTo, setDockedTo] = useState(DOCK_POSITION.TOP);

  return (
    <div className={cx('app', windowState.edge)}>
      <AppShortcuts />
      <FreeTextSearch dockedTo={dockedTo} />
      <ToolBar
        tools={[
          {
            label: <FaCog />
          },
          {
            label: <FaChevronUp />,
            onClick: () => {
              windowActions.lockTop();
              setDockedTo(DOCK_POSITION.TOP);
            },
            disabled: () => windowState.edge === Constants.ScreenEdge.TOP
          },
          {
            label: <FaChevronLeft />,
            onClick: () => {
              windowActions.lockLeft();
              setDockedTo(DOCK_POSITION.LEFT);
            },
            disabled: () => windowState.edge === Constants.ScreenEdge.LEFT
          },
          {
            label: <FaChevronRight />,
            onClick: () => {
              windowActions.lockRight();
              setDockedTo(DOCK_POSITION.RIGHT);
            },
            disabled: () => windowState.edge === Constants.ScreenEdge.RIGHT
          }
        ]}
      />
    </div>
  );
};
