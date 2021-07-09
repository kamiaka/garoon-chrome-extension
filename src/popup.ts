import {
  dateString,
  localizeHTML,
  newElem,
  timeString,
  __,
} from './common/util';
import * as store from './common/store';
import * as bg from './common/background';

declare global {
  interface Window {
    update: () => Promise<void>;
  }
}

function init() {
  initDOM();
  render();
}

function initDOM() {
  localizeHTML();
  refreshButton().addEventListener('click', refresh);
  portalOpener().addEventListener('click', openPortal);
}

function render() {
  setUpdatedAt();
  setNotifications();
  setError();
}

const elem = <T extends HTMLElement>(selector: string): T =>
  document.querySelector<T>(selector)!;

const refreshContainer = () => elem<HTMLDivElement>('.refresh-container');
const refreshButton = () => elem<HTMLButtonElement>('.refresh-button');
const refreshTime = () => elem<HTMLSpanElement>('.last-updated-time');
const portalOpener = () => elem<HTMLAnchorElement>('.portal-opener');
const notificationList = () => elem<HTMLUListElement>('.notification-list');
const errorContainer = () => elem<HTMLDivElement>('.error-container');
const errorMessage = () => elem<HTMLDivElement>('.error-message');

async function refresh() {
  const container = refreshContainer();
  const btn = refreshButton();
  container.dataset.isLoading = 'true';
  btn.disabled = true;
  try {
    await bg.update();
  } catch (e) {
    console.warn('refresh error', e);
  }
  container.dataset.isLoading = '';
  btn.disabled = false;

  render();
}

async function openPortal() {
  const { baseURL } = await store.load();
  chrome.tabs.create({
    url: baseURL,
  });
}

async function setUpdatedAt() {
  const { lastUpdate } = await store.load();
  console.info('lastUpdate', lastUpdate);
  if (!lastUpdate) {
    return;
  }

  const time = timeString(new Date(lastUpdate));

  refreshTime().textContent = time;
}

async function setNotifications() {
  const { notifications } = await store.load();

  const container = notificationList();

  while (container.lastElementChild) {
    container.removeChild(container.lastElementChild);
  }

  if (!notifications?.length) {
    const item = document.createElement('li');
    item.className = 'no-notification';
    item.appendChild(document.createTextNode(__('no_notification')));
    container.appendChild(item);
    return;
  }

  const currentDate = dateString(new Date());

  notifications.forEach(v => {
    const d = new Date(v.createdAt);
    const date = dateString(d);
    const a = newElem('a', {
      children: [
        newElem('div', {
          className: 'notification-time',
          children: currentDate === date ? timeString(d) : date,
        }),
        newElem('div', {
          className: 'notification-title',
          children: v.title,
        }),
        v.body &&
          newElem('div', {
            className: 'notification-body',
            children: v.body,
          }),
        newElem('div', {
          className: 'notification-user',
          children: v.creator.name,
        }),
      ],
    });
    a.onclick = async () => {
      const { notifications } = await store.load();
      await store.save({
        notifications: notifications?.filter(
          n => n.notificationKey !== v.notificationKey,
        ),
      });
      bg.updateBadge();
      chrome.tabs.create({
        url: v.url,
      });
    };
    container.appendChild(newElem('li', { children: a }));
  });
}

async function setError() {
  const { error } = await store.load();
  if (error) {
    errorMessage().textContent = error;
  }
  errorContainer().hidden = !error;
}

document.addEventListener('DOMContentLoaded', init);
