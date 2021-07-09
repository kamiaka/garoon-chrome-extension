// isFetchError returns whether err is fetch error.
// fetch error is occurred when network connection failed, or other.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFetchError(err: any): err is Error {
  return (
    err instanceof Error &&
    err.name === 'TypeError' &&
    err.message === 'Failed to fetch'
  );
}
