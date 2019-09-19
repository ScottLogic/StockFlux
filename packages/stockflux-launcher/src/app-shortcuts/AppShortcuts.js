import React, { useEffect, useState } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import Components from 'stockflux-components';
import './AppShortcuts.css';

export default () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    OpenfinApiHelpers.getStockFluxApps()
      .then(setApps)
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
          return <AppShortcut key={app.appId} />;
        })}
    </div>
  );
};
