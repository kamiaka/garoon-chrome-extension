/**
 * Garoon Notificator background script.
 */

import {
  clearError,
  handleError,
  initNotificationEvent,
  notify,
  requireAuth,
  scheduleURL,
  setError,
  timeString,
  __,
} from './common';
import {
  GaroonAPI,
  ModuleID,
  ScheduleEvent,
  Notification,
  ErrorResponse,
} from './common/api';
import * as store from './common/store';
import * as message from './common/background';
import { updateBadge } from './common/util/badge';

async function update() {
  try {
    const { baseURL } = await store.load();
    if (!baseURL) {
      return await setError(__('err_no_base_url'));
    }

    await updateNotifications(baseURL);
    await updateScheduleEvents(baseURL);

    await store.save({ lastUpdate: Date.now() });

    await clearError();
  } catch (e) {
    if (e instanceof ErrorResponse && e.status() === 401) {
      requireAuth();
      return;
    }
    throw e;
  }
}

async function updateNotifications(baseURL: string) {
  const resp = await new GaroonAPI(baseURL).getNotificationItems();
  await store.save({ notifications: resp.items });
  updateBadge();
}

async function notifyNotifications(knownItems?: Notification[]) {
  const { notifiesNotifications, notifications } = await store.load();
  if (notifiesNotifications) {
    notifications
      ?.filter(
        item => !knownItems?.some(knownItem => item.url === knownItem.url),
      )
      .forEach(item => {
        notify(
          {
            title: item.title,
            message:
              garoonModuleName(item.moduleId) +
              '\n' +
              item.creator.name +
              ', ' +
              timeString(new Date(item.createdAt)),
          },
          {
            onClicked: () => {
              chrome.tabs.create({
                url: item.url,
              });
            },
          },
        );
      });
  }
}

function garoonModuleName(id: ModuleID): string {
  switch (id) {
    case ModuleID.Schedule:
      return __('schedule');
    case ModuleID.SpaceDiscussion:
      return __('space');
    case ModuleID.Workflow:
      return __('workflow');
    case ModuleID.Bulletin:
      return __('bulletin');
    default:
      return id;
  }
}

async function updateScheduleEvents(baseURL: string) {
  const data = await new GaroonAPI(baseURL).getScheduleEvents();

  const now = Date.now();
  const events = data.events.filter(ev => {
    const duration = new Date(ev.start.dateTime).getTime() - now;
    // before 5m and after 30days
    return -300000 < duration && duration < 30 * 86400000;
  });
  await store.save({ events: events });

  const { hooksURL } = await store.load();
  if (hooksURL) {
    const resp = await callWebHook(hooksURL, JSON.stringify(data));
    if (!resp.ok) {
      setError(__('err_web_hook_failed'));
    }
  }
}

async function callWebHook(url: string, data: string) {
  return await fetch(url, {
    method: 'POST',
    body: data,
  });
}

async function notifyEvents() {
  const { events, notifiesEvents, notifyMinutesBefore } = await store.load();
  if (!notifiesEvents) {
    return;
  }

  const duration = notifyMinutesBefore || 0;

  const curMin = Math.round(Date.now() / 60000);
  const { baseURL } = await store.load();
  events?.forEach(ev => {
    const startMin = Math.round(new Date(ev.start.dateTime).getTime() / 60000);
    if (curMin + duration === startMin) {
      notifyEvent(
        ev,
        baseURL &&
          `${baseURL.replace(/\/+$/, '')}/schedule/view?event=${ev.id}`,
        duration,
      );
    }
  });
}

async function notifyEvent(ev: ScheduleEvent, url?: string, duration?: number) {
  const title = ev.eventMenu ? `${ev.eventMenu}: ${ev.subject}` : ev.subject;
  notify(
    {
      title,
      message:
        (duration ? `${duration} ${__('minutes_before')}: ` : '') + ev.notes,
    },
    {
      onClicked: () => {
        if (url) {
          chrome.tabs.create({
            url,
          });
        }
      },
    },
  );
}

function run() {
  chrome.runtime.onInstalled.addListener(details => {
    console.info(`installed reason: ${details.reason}`);
    if (details.reason === 'install') {
      store.reset();
    }
  });

  initNotificationEvent();

  window.addEventListener('unhandledrejection', ev => {
    ev.preventDefault();
    handleError(ev.reason);
  });

  chrome.alarms.onAlarm.addListener(async alarm => {
    try {
      await notifyEvents();

      const { refreshInMinutes, lastUpdate } = await store.load();
      const minutes = Math.round((Date.now() - (lastUpdate || 0)) / 60000);

      if (refreshInMinutes <= minutes) {
        if (!navigator.onLine) {
          console.info('navigator offline', new Date().toString());
          return;
        }
        const { notifications } = await store.load();
        await update();
        await notifyNotifications(notifications);

        const {
          lastUpdate: last,
          notifications: notices,
          events,
          error,
        } = await store.load();

        console.info(
          'update',
          timeString(new Date()),
          refreshInMinutes <= minutes,
          {
            update: last,
            error,
            notifications: notices,
            events,
          },
        );
      }
    } catch (e) {
      console.warn('caught error', e instanceof Error ? e : JSON.stringify(e));
    }
  });

  message.listen(message.Type.Update, update);
  message.listen(message.Type.UpdateBadge, updateBadge);

  chrome.alarms.create('watchNotification', {
    periodInMinutes: 1,
  });

  update();
}

run();
