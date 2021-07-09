import { icons } from '../constants';

interface NotificationHandler {
  id: NotificationID;
  onClicked?: (id: NotificationID) => void;
}
const notificationHandlers: NotificationHandler[] = [];

type NotificationID = string;
let notificationCounter = Date.now();

function onShowNotificationSettings() {
  chrome.tabs.create({
    url: '/options.html',
  });
}

function onClickedNotification(id: NotificationID) {
  notificationHandlers.find(item => item.id === id)?.onClicked?.(id);
  chrome.notifications.clear(id);
}

export function initNotificationEvent() {
  chrome.notifications.onClicked.addListener(onClickedNotification);
  chrome.notifications.onShowSettings.addListener(onShowNotificationSettings);
}

export async function notify(
  options: chrome.notifications.NotificationOptions,
  handlers?: Omit<NotificationHandler, 'id'>,
): Promise<NotificationID> {
  return new Promise(resolve => {
    const id = `grn-notification-${++notificationCounter}`;
    chrome.notifications.create(
      id,
      {
        type: 'basic',
        iconUrl: icons.Logo,
        title: '',
        message: '',
        ...options,
      },
      id => resolve(id),
    );
    notificationHandlers.push({ ...handlers, id });
  });
}
