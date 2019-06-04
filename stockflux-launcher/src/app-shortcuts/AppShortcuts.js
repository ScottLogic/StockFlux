import React from 'react';
import { AppDirectoryHooks } from 'openfin-react-hooks';
import AppShortcut from './app-shortcut/AppShortcut';
import './AppShortcuts.css';

const fixedAppIdPrefix = 'stockflux-watchlist';

export default () => {
  const apps = AppDirectoryHooks.useAppSearch('*@stockflux.scottlogic.com');

  return (
    <div className="app-shortcuts">
      {apps
        .filter(({ appId }) => appId.indexOf(fixedAppIdPrefix) === 0)
        .map(app => <AppShortcut key={app.appId} app={app} />)}
    </div>
  );
};
