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
  if (typeof defaultValue === 'string') {
    elem.value = defaultValue;
  } else if (typeof defaultValue === 'boolean') {
    elem.checked = defaultValue;
  }
  return elem;
}

function textarea(
  name: string,
  defaultValue?: string | undefined,
): HTMLTextAreaElement {
  const elem = document.querySelector(
    `textarea[name=${name}]`,
  ) as HTMLTextAreaElement;
  if (typeof defaultValue === 'string') {
    elem.value = defaultValue;
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
  const ignoreEventKeywords = textarea(
    'ignore-event-keywords',
    v.ignoreEventKeywords || defaultConfig.ignoreEventKeywords,
  );
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
  const hooksHeaders = textarea(
    'webhook-headers',
    v.hooksHeaders || v.hooksHeaders,
  );

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
        ignoreEventKeywords: ignoreEventKeywords.value,
        hooksHeaders: hooksHeaders.value,
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
