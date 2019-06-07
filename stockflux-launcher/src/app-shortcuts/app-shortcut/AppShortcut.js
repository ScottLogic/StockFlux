import React from 'react';
import { FaCube } from 'react-icons/fa';
import { Intents } from 'stockflux-core';
import './AppShortcut.css';

const launcherIconName = 'launcher.png';

export default ({app}) => {
  const launcherIcon = app.icons.find(({ icon: iconUrl }) => iconUrl.split('/').slice(-1)[0] === launcherIconName);
  return (
    <div className="app-shortcut" title={app.name} onClick={() => {
      if (app.customConfig.launcherIntent) {
        Intents[app.customConfig.launcherIntent]()
      }
    }}>
      {launcherIcon
        ? <img src={launcherIcon.icon} alt={app.name} />
        : <FaCube />}
    </div>
  );
};
