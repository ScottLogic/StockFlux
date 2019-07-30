import React, { useEffect, useState } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import Components from 'stockflux-components';
import './AppShortcuts.css';

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
      .then(results => {
        console.log('results', results);
        setApps(results);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="app-shortcuts">
      {apps
        .filter(
          app =>
            app.customConfig !== undefined && app.customConfig.showInLauncher
        )
        .map(app => {
          /* Get the appropriate shortcut button by taking a part of stocklux appId 
             (e.g. "news", "watchlist", "chart"), capitalizing the first letter and
             appending "Shortcut" at the end
          */
          const AppShortcut =
            Components[
              app.appId
                .split('stockflux-')[1]
                .charAt(0)
                .toUpperCase() +
                app.appId.slice(11) +
                'Shortcut'
            ];
          return <AppShortcut key={app.appId} app={app} />;
        })}
    </div>
  );
};
