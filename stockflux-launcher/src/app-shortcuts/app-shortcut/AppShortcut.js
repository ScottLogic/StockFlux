import React from 'react';
import { FaCube } from 'react-icons/fa';
import './AppShortcut.css';

const launcherIconName = 'launcher.png';

export default ({ app: { name, icons } }) => {
  const launcherIcon = icons.find(({ icon: iconUrl }) => iconUrl.split('/').slice(-1)[0] === launcherIconName)

  return (
    <div className="app-shortcut" title={name}>
      {launcherIcon
        ? <img src={launcherIcon.icon} alt={name} />
        : <FaCube />}
    </div>
  );
};
