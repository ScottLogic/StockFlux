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
  getCurrentWindowOptions()
    .then(options => options.customData.apiBaseUrl)
    .then(baseUrl =>
      fetch(`${baseUrl}/apps/v1`, {
        method: 'GET'
      })
    )
    .then(async response => await response.json());
