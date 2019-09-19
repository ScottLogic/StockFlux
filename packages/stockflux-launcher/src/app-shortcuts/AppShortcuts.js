import React, { useEffect, useState } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import Components from 'stockflux-components';
import './AppShortcuts.css';
import { createChild } from '../childWindowLauncher';

export default () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const options = {
      method: 'GET'
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
        .filter(
          app =>
            app.customConfig !== undefined &&
            app.customConfig.showInLauncher &&
            app.appId.indexOf('stockflux-') === 0
        )
        .map(app => {
          const AppShortcut =
            Components[
              app.appId
                .split('stockflux-')[1]
                .charAt(0)
                .toUpperCase() +
                app.appId.slice(11) +
                'Shortcut'
            ];
          return (
            <AppShortcut
              key={app.appId}
              app={app}
              onClick={() => createChild(app, 'AAPL')}
            />
          );
        })}
    </div>
  );
};
