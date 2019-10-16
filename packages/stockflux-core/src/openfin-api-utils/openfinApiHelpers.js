export const createWindow = async windowOptions => {
  return await window.fin.Window.create(windowOptions);
};

export const getCurrentWindow = async () => {
  return await window.fin.Window.getCurrent();
};

export const getCurrentWindowSync = () => {
  return window.fin.Window.getCurrentSync();
};

export const getChildWindows = async () => {
  const application = await window.fin.Application.getCurrent();
  return await application.getChildWindows();
};

export const getCurrentWindowOptions = async () => {
  const currentWindow = await getCurrentWindow();
  return await currentWindow.getOptions();
};

export const getAllApps = async () =>
  await getCurrentWindowOptions()
    .then(options => options.customData.apiBaseUrl)
    .then(baseUrl =>
      fetch(`${baseUrl}/apps/v1`, {
        method: 'GET'
      })
    )
    .then(async response => await response.json());

export const getStockFluxApps = async () =>
  await getAllApps().then(apps =>
    apps.filter(app => app.appId.indexOf('stockflux-') === 0)
  );

export const getStockFluxApp = async appId =>
  await getCurrentWindowOptions()
    .then(options => options.customData.apiBaseUrl)
    .then(baseUrl =>
      fetch(`${baseUrl}/apps/v1/${appId}`, {
        method: 'GET'
      })
    )
    .then(response => response.json());

export const getWindow = async () => {
  return await window.fin;
};

export const sendInterApplicationMessage = async (uuid, topic, payload) =>
  await window.fin.InterApplicationBus.send({ uuid }, topic, payload);

export const useMain = async mountApp =>
  await window.fin.desktop.main(mountApp);
