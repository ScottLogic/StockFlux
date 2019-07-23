async function getWindowOptions() {
  const currentWindow = await window.fin.Window.getCurrent();
  return currentWindow.getOptions();
}

export async function getSecuritiesData() {
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/securities-v2`
  );
  const securities = await response.json();
  return securities;
}

export async function getSecurity(securityId) {
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/securities-v2/${securityId}`
  );
  const security = await response.json();
  return security;
}

export async function postSecurity(security) {
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/securities-v2`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(security)
    }
  );
  if (response.status === 201) {
    const responseJSON = await response.json();
    return responseJSON;
  } else if (response.status === 400) {
    const responseJSON = await response.json();
    throw new Error(responseJSON.messages);
  } else if (response.status === 500) {
    throw new Error("Something went wrong, please try again later");
  } else {
    throw new Error("Unknown error occured, please try again later");
  }
}
