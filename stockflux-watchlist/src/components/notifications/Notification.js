/* eslint-disable no-undef */
export const showNotification = notificationDetails => {
  const details = notificationDetails;
  new fin.desktop.Notification({
    url: './notification.html',
    message: details.message
  });
};
