async function getWindowOptions() {
  const currentWindow = await window.fin.Window.getCurrent();
  return currentWindow.getOptions();
}

export async function getSecuritiesData() {
  const options = await getWindowOptions();
  const response = await fetch(`${options.customData.apiBaseUrl}/securities-v2`);
  const securities = await response.json();
  return securities;
}
