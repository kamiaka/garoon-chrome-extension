import { isFetchError, ErrorResponse } from '../api';
import * as store from '../store';
import { updateBadge } from './badge';
import { __ } from './message';
import { notify } from './notification';

export async function requireAuth(inAction?: boolean) {
  const { notifiesRequireAuth, error, baseURL } = await store.load();
  const msg = __('err_unauthenticated');

  await setError(msg);

  if (!inAction && notifiesRequireAuth && error !== msg) {
    notify(
      {
        title: msg,
      },
      {
        onClicked: () =>
          chrome.tabs.create({
            url: baseURL,
          }),
      },
    );
  }
}

export async function setError(error?: string) {
  await store.save({ error, lastUpdate: Date.now() });

  updateBadge();
}

export async function clearError() {
  await setError(undefined);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleError(err: any, inAction?: boolean) {
  if (isFetchError(err)) {
    await setError(__('failed_to_fetch'));
    return;
  }

  if (err instanceof ErrorResponse) {
    if (err.status() === 401) {
      await requireAuth(inAction);
      return;
    }

    console.warn(`API Error status ${err.status()}`);
    return;
  }
  Promise.reject(err);
}
