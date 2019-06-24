import React from 'react';
import { AppDirectoryHooks } from 'openfin-react-hooks';
import AppShortcut from './app-shortcut/AppShortcut';
import './AppShortcuts.css';

export default () => {
  const apps = AppDirectoryHooks.useAppSearch('*@stockflux.scottlogic.com');

  return (
    <div className="app-shortcuts">
      {apps
        .filter(app => app.customConfig !== undefined && app.customConfig.showInLauncher)
        .map(app => <AppShortcut key={app.appId} app={app} />)}
    </div>
  );
};
