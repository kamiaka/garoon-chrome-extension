import * as store from './common/store';
import { defaultConfig } from './common/store';

import { localizeHTML } from './common/util';

function input(
  name: string,
  defaultValue?: string | boolean | undefined,
): HTMLInputElement {
  const elem = document.querySelector(
    `input[name=${name}]`,
  ) as HTMLInputElement;
  console.log('input', name);
  if (typeof defaultValue === 'string') {
    elem.value = defaultValue;
  } else if (typeof defaultValue === 'boolean') {
    elem.checked = defaultValue;
  }
  return elem;
}

async function init() {
  localizeHTML();

  const v = await store.load();

  const baseURL = input('base-url', v.baseURL);
  const refreshInMinutes = input(
    'refresh-in-minutes',
    `${v.refreshInMinutes || defaultConfig.refreshInMinutes}`,
  );
  const notifiesNotifications = input(
    'notifies-notifications',
    v.notifiesNotifications || defaultConfig.notifiesNotifications,
  );
  const notifiesEvents = input('notifies-events', v.notifiesEvents);
  const notifyMinutesBefore = input(
    'notify-minutes-before',
    `${v.notifyMinutesBefore || defaultConfig.notifyMinutesBefore}`,
  );
  const notifiesRequireAuth = input(
    'notifies-require-auth',
    v.notifiesRequireAuth || defaultConfig.notifiesRequireAuth,
  );
  const usesWebhook = input('uses-webhook', !!v.hooksURL);
  const hooksURL = input('webhook-url', v.hooksURL);

  document
    .querySelector('#ext-options')!
    .addEventListener('submit', async ev => {
      ev.preventDefault();
      await store.save({
        baseURL: baseURL.value,
        refreshInMinutes:
          parseInt(refreshInMinutes.value, 10) ||
          defaultConfig.refreshInMinutes,
        notifiesNotifications: notifiesNotifications.checked,
        notifiesEvents: notifiesEvents.checked,
        notifyMinutesBefore:
          parseInt(notifyMinutesBefore.value, 10) ||
          defaultConfig.refreshInMinutes,
        notifiesRequireAuth: notifiesRequireAuth.checked,
        hooksURL: usesWebhook.checked ? hooksURL.value : '',
      });
      const saved = document.querySelector<HTMLSpanElement>('.saved')!;
      saved.hidden = false;
      saved.classList.add('fade-out');
      setTimeout(() => {
        saved.classList.remove('fade-out');
        saved.hidden = true;
      }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', init);
