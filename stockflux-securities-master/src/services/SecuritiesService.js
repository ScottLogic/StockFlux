import ValidationError from '../errors/ValidationError';

async function getWindowOptions() {
  const currentWindow = await window.fin.Window.getCurrent();
  return currentWindow.getOptions();
}

export async function getSecurities() {
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities`
  );
  if (response.ok) return await response.json();
  else {
    throw new Error('Something went wrong while fetching securities.');
  }
}

export async function getSecurity(securityId) {
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities/${securityId}`
  );
  if (response.ok) return await response.json();
  else {
    throw new Error(
      `Something went wrong while fetching security ${securityId}.`
    );
  }
}

export async function postSecurity(security) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(security)
  };

  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities`,
    fetchOptions
  );
  if (response.ok) return;
  else {
    const error = await response.json();
    throw new ValidationError(error.messages);
  }
}

export async function updateSecurity(securityId, security) {
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(security)
  };
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities/${securityId}`,
    fetchOptions
  );
  if (response.ok) return;
  else {
    const error = await response.json();
    throw new ValidationError(error.messages);
  }
}

export async function deleteSecurity(securityId) {
  const fetchOptions = {
    method: 'DELETE'
  };
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities/${securityId}`,
    fetchOptions
  );
  if (response.ok) return;
  else {
    throw new Error(
      `Something went wrong while deleting security ${securityId}.`
    );
  }
}

export async function patchSecurity(securityId, updates) {
  const fetchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  };
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities/${securityId}`,
    fetchOptions
  );
  if (response.ok) return await response;
  else {
    throw new Error(
      `Something went wrong while fetching security ${securityId}.`
    );
  }
}
