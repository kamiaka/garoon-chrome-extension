import { ScheduleEvent, Notification } from '../api';

export interface Store {
  error?: string;

  baseURL?: string;

  refreshInMinutes: number;
  lastUpdate?: number;

  notifications?: Notification[];
  events?: ScheduleEvent[];

  notifiesRequireAuth?: boolean;

  notifiesNotifications?: boolean;

  notifiesEvents?: boolean;
  notifyMinutesBefore?: number;
  ignoreEventKeywords: string;

  hooksURL?: string;
  hooksHeaders?: string;
}

export const defaultConfig: Store = {
  refreshInMinutes: 5,
  notifiesRequireAuth: true,
  notifiesNotifications: true,
  notifiesEvents: true,
  ignoreEventKeywords: '',
  notifyMinutesBefore: 10,
  baseURL: '',
  hooksURL: '',
  hooksHeaders: '',
};

const storageKey = 'grn.config';

export function load(): Promise<Store> {
  return new Promise(resolve => {
    chrome.storage.local.get(items => {
      resolve({ ...defaultConfig, ...(items[storageKey] || {}) });
    });
  });
}

export async function save(input: Partial<Store>): Promise<void> {
  const data = await load();

  return new Promise(resolve => {
    chrome.storage.local.set({ [storageKey]: { ...data, ...input } }, resolve);
  });
}

export async function reset(): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.local.remove(storageKey, resolve);
  });
}
