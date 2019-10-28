import { OpenfinApiHelpers } from 'stockflux-core';

export const showNotification = notificationDetails => {
  const details = notificationDetails;
  OpenfinApiHelpers.showNotification('./notification.html', details.message);
};
