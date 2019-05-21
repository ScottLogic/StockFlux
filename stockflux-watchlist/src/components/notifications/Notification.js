/* eslint-disable no-undef */
export const showCustomNotification = notificationDetails => {
  const details = notificationDetails || {
    message: '',
    link: ''
  };
  new fin.desktop.Notification({
    url: './notification.html',
    message: details.message
  });
};
