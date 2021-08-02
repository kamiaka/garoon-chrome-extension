import { browser } from 'webextension-polyfill-ts';

const execute = async () => {
  const value = await browser.storage.local.get('date');
  console.info(value.date || '日時が記録されていません');

  await browser.storage.local.set({ date: new Date().toString() });
  console.info('現在の日時を記録しました');
};

execute();
