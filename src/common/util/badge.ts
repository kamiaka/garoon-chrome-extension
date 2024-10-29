import { icons } from '../constants';
import { dateString, timeString } from './message';
import * as store from '../store';

export async function updateBadge() {
  const { error, notifications } = await store.load();
  const items = notifications || [];

  chrome.action.setIcon({
    path: error ? icons.GrayLogo : icons.Logo,
  });

  if (error) {
    const d = new Date();
    console.info(error, `${dateString(d)} ${timeString(d)}`);

    chrome.action.setBadgeText({
      text: '!',
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#e20240',
    });
    return;
  }

  chrome.action.setBadgeText({
    text:
      items.length > 0 ? (items.length > 99 ? '99+' : `${items.length}`) : '',
  });
  chrome.action.setBadgeBackgroundColor({
    color: '#4a7ad2',
  });
}
