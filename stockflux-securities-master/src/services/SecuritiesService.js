async function getWindowOptions() {
  const currentWindow = await window.fin.Window.getCurrent();
  return currentWindow.getOptions();
}

export async function getSecurities() {
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities`
  );
  if (response.status === 200) return await response.json();
  else {
    throw new Error('Something went wrong while fetching securities.');
  }
}

export async function getSecurity(securityId) {
  const options = await getWindowOptions();
  const response = await fetch(
    `${options.customData.apiBaseUrl}/admin/securities/${securityId}`
  );
  if (response.status === 200) return await response.json();
  else {
    throw new Error(
      `Something went wrong while fetching security ${securityId}.`
    );
  }
}

export async function postSecurity(security, errorCallback, successCallback) {
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
  if (response.status === 201) {
    successCallback();
    return;
  } else {
    const errors = await response.json();
    if (errorCallback) errorCallback(errors.messages);
    else
      throw new Error(
        `Something went wrong while creating security ${security.name}.`
      );
  }
}

export async function updateSecurity(
  securityId,
  security,
  errorCallback,
  successCallback
) {
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
  if (response.status === 200) {
    successCallback();
    return;
  } else {
    const errors = await response.json();
    if (errorCallback) errorCallback(errors.messages);
    else
      throw new Error(
        `Something went wrong while updating security ${securityId}.`
      );
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
  if (response.status === 204) return;
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
  if (response.status === 200) {
    return await response;
  } else {
    throw new Error(
      `Something went wrong while fetching security ${securityId}.`
    );
  }
}
