# Developer Proxy

Use of the developer proxy allows you to develop locally in reguards to each seperate app. This can be ran be using the command `npm start` with `./developer-proxy` directory. 

# App Directory
To modify the app directory to use the local proxy, modify the file `./src/static/apps.json` new stockflux or external apps can be added in for example this is the addition for a Giant Machines Watchlist
```json
{
    "images": [],
    "intents": [
      {
        "name": "WatchlistAdd"
      },
      {
        "name": "WatchlistView"
      }
    ],
    "contactEmail": "contact@giantmachines.com",
    "manifest": "https://stockflux.scottlogic.com/api/apps/v1/giantmachines-watchlist/app.json",
    "manifestType": "openfin",
    "description": "Giant Machines Watchlist",
    "title": "Watchlist",
    "icons": [
      {
        "icon": "https://stockflux.scottlogic.com/artifacts/giantmachines-watchlist/favicon.ico"
      },
      {
        "icon": "https://stockflux.scottlogic.com/artifacts/giantmachines-watchlist/launcher.png"
      }
    ],
    "supportEmail": "contact@giantmachines.com",
    "customConfig": {
      "showInLauncher": true,
      "launcherIntent": "viewWatchlist"
    },
    "appId": "giantmachines-watchlist",
    "name": "giantmachines-watchlist",
    "publisher": "Giant Machines"
  }
  ```
  
  The `showInLauncher` value is the boolean option which allows a new option to appear in the Launcher bar. This needs to be set to `true`.
  `description` will be the text display which is shown in the launcher menu, and can be customised to change the menu option name. 