import ValidationError from "./ValidationError";

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
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(security)
  };

  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/securities-v2`,
    fetchOptions
  );
  const json = await response.json();

  if (response.ok) {
    return json;
  }
  throw new ValidationError(json.messages);
}

export async function updateSecurity(securityId, security) {
  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(security)
  };
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/securities-v2/${securityId}`,
    fetchOptions
  );
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  throw new ValidationError(json.messages);
}

export async function deleteSecurity(securityId) {
  const fetchOptions = {
    method: "DELETE"
  };
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/securities-v2/${securityId}`,
    fetchOptions
  );
  const json = await response.json();
  if (response.ok) {
    return json;
  }
  throw new ValidationError(json.messages);
}
