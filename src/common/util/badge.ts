import { icons } from '../constants';
import { dateString, timeString } from './message';
import * as store from '../store';

export async function updateBadge() {
  const { error, notifications } = await store.load();
  const items = notifications || [];

  console.log('count', items.length);

  chrome.browserAction.setIcon({
    path: error ? icons.GrayLogo : icons.Logo,
  });

  if (error) {
    const d = new Date();
    console.info(error, `${dateString(d)} ${timeString(d)}`);

    chrome.browserAction.setBadgeText({
      text: '!',
    });
    chrome.browserAction.setBadgeBackgroundColor({
      color: '#e20240',
    });
    return;
  }

  chrome.browserAction.setBadgeText({
    text:
      items.length > 0 ? (items.length > 99 ? '99+' : `${items.length}`) : '',
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#4a7ad2',
  });
}
