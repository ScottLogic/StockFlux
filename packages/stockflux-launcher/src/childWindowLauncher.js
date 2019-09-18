import { OpenfinApiHelpers } from "stockflux-core";

async function createChildWindow(options) {
  const application = await window.fin.Application.getCurrent();
  const childWindows = await application.getChildWindows();
  const currentWindow = await window.fin.Window.getCurrent();
  const currentOptions = await currentWindow.getOptions();

  options.uuid = currentOptions.uuid;

  let match;
  for (let i = 0; i < childWindows.length; i++) {
    const childWindowOptions = await childWindows[i].getOptions();
    if (childWindowOptions.name === options.name) {
      match = childWindows[i];
      break;
    }
  }

  if (match) {
    match.bringToFront();
    return true;
  }

  await OpenfinApiHelpers.createWindow(options);
  return true;
}

async function getChildWindowOptions(manifest) {
  const manifestUrl =
    typeof manifest === "string" ? manifest : manifest.manifest;

  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error("Could not retrieve manifest");
  }

  const body = await response.json();
  return body.startup_app;
}

export async function createNewsChildWindow(manifest, symbol, name) {
  const options = await getChildWindowOptions(manifest);
  options.name = `stockflux-news${symbol ? `[${symbol}]` : ""}`;

  // Add symbol and name to customData for launching news application

  if (!options.customData) {
    options.customData = {};
  }

  options.customData.symbol = symbol;
  options.customData.name = name;

  return await createChildWindow(options);
}

export async function createWatchlistChildWindow(manifest, symbol) {
  const options = await getChildWindowOptions(manifest);
  options.name = `stockflux-watchlist`;

  return await createChildWindow(options);
}

export async function createChartChildWindow(manifest, symbol) {
  const options = await getChildWindowOptions(manifest);
  options.name = `stockflux-chart${symbol ? `[${symbol}]` : ""}`;

  // Add symbol to customData for launching chart app

  return await createChildWindow(options);
}
