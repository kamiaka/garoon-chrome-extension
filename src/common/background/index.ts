import { handleError } from '../util';

export const Type = {
  Update: 'msg_update',
  UpdateBadge: 'msg_update_badge',
} as const;
export type Type = typeof Type[keyof typeof Type];

export interface Message {
  type: Type;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
}

export interface Response<T> {
  data?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListenerFunc<T, Args extends any[]> = (...args: Args) => Promise<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Listener<T, Args extends any[]> {
  type: Type;
  callback: ListenerFunc<T, Args>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listeners: Listener<any, any>[] = [];

function isMessage(msg: unknown): msg is Message {
  return !!(typeof msg === 'object' && msg && 'type' in msg && 'args' in msg);
}

function onMessage(
  msg: unknown,
  sender: chrome.runtime.MessageSender,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendResponse: (v?: any) => void,
) {
  if (!isMessage(msg)) {
    sendResponse({
      error: new Error('invalid message'),
    });
    return;
  }
  listeners.forEach(v => {
    if (msg.type === v.type) {
      v.callback(...msg.args).then(
        data => sendResponse({ data }),
        error => {
          console.warn('got listener error', error);
          handleError(error, true).then(() => sendResponse({ error }));
        },
      );
    }
  });

  // define async response.
  // see, https://developer.chrome.com/extensions/runtime#event-onMessage
  return true;
}

export type UnregisterFunc = () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function listen<T, Args extends any[] = []>(
  type: Type,
  callback: ListenerFunc<T, Args>,
): UnregisterFunc {
  if (listeners.length === 0) {
    chrome.runtime.onMessage.addListener(onMessage);
  }
  const listener = {
    type,
    callback,
  };
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    if (listeners.length === 0) {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendMessage<T>(type: Type, ...args: any[]): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type,
        args,
      },
      (res?: Response<T>) => {
        if (!res) {
          reject(new Error('no response'));
        } else if (res.error) {
          reject(res.error);
        } else {
          resolve(res.data);
        }
      },
    );
  });
}

export async function update() {
  return sendMessage<string>(Type.Update);
}

export async function updateBadge() {
  return sendMessage(Type.UpdateBadge);
}
