import React, { useEffect, useState } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';

import AppShortcut from './app-shortcut/AppShortcut';
import './AppShortcuts.css';

export default () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const options = {
      method: 'GET',
    };

    OpenfinApiHelpers.getCurrentWindow()
        .then(window => window.getOptions())
        .then(options => options.customData.apiBaseUrl)
        .then(baseUrl => fetch(`${baseUrl}/apps/v1`, options))
        .then(response => response.json())
        .then(results => setApps(results))
        .catch(console.error);
  }, []);

  return (
    <div className="app-shortcuts">
      {apps
        .filter(app => app.customConfig !== undefined && app.customConfig.showInLauncher)
        .map(app => <AppShortcut key={app.appId} app={app} />)}
    </div>
  );
};
