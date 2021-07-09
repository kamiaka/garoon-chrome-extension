export function __(key: string, defaultValue?: string) {
  const msg = chrome.i18n.getMessage(key);
  if (!msg && !defaultValue) {
    console.warn(`undefined message key: ${key}`);
  }
  return msg || defaultValue || key;
}

export function zeroPad(n: number, width: number = 2): string {
  return (new Array(width).fill('0').join('') + n).slice(-width);
}

export function dateString(d: Date, sep: string = '-'): string {
  return [
    d.getFullYear(),
    zeroPad(d.getMonth() + 1),
    zeroPad(d.getDate()),
  ].join(sep);
}

export function timeString(d: Date, sep: string = ':'): string {
  return [d.getHours(), d.getMinutes()].map(n => zeroPad(n, 2)).join(sep);
}

export function timeZoneOffsetString(d: Date, sep: string = ':'): string {
  const offset = -d.getTimezoneOffset();
  return [
    offset < 0 ? '-' : '+' + zeroPad(Math.abs(offset / 60)),
    zeroPad(Math.abs(offset % 60)),
  ].join(sep);
}
