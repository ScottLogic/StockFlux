import { OpenfinApiHelpers } from "stockflux-core";

export default async function createNewsChildWindow(manifest, symbol, name) {
  const manifestUrl =
    typeof manifest === "string" ? manifest : manifest.manifest;

  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error("Could not retrieve news manifest");
  }

  const body = await response.json();
  const options = body.startup_app;

  options.uuid = "stockflux-launcher";
  if (symbol) {
    options.name = `${options.name}[${symbol}]`;
  }

  const application = await window.fin.Application.getCurrent();
  const childWindows = await application.getChildWindows();

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

  // const matches = childWindows.filter(async childWindow => {
  //   const childWindowOptions = await childWindow.getOptions();
  //   console.log(options.name, childWindowOptions.name);
  //   return childWindowOptions.name === options.name;
  // });

  // if (existingChildWindows[options.name]) {
  //   existingChildWindows[options.name].bringToFront();
  //   return true;
  // }

  // OpenfinApiHelpers.createWindow(options)
  //   .then(window => {
  //     existingChildWindows[options.name] = window;
  //     existingChildWindows[options.name].on("closed", () => {
  //       delete existingChildWindows[options.name];
  //     });
  //   })
  //   .catch(e => console.error("Could not open child window"));

  // console.log(options);
}
