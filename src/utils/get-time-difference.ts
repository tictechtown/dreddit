export function timeDifference(timestampInMs: number, locale: string = 'en-US') {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const current = Date.now();
  const elapsed = current - timestampInMs;

  if (elapsed < msPerMinute) {
    return `${Math.floor(elapsed / 1000)}s ago`;
  } else if (elapsed < msPerHour) {
    return `${Math.floor(elapsed / msPerMinute)}m ago`;
  } else if (elapsed < msPerDay) {
    return `${Math.floor(elapsed / msPerHour)}h ago`;
  } else if (elapsed < msPerMonth) {
    return `${Math.floor(elapsed / msPerDay)}d ago`;
  } else if (elapsed < msPerYear) {
    const value = Math.floor(elapsed / msPerMonth);
    return `${value} month${value > 1 ? 's' : ''} ago`;
  } else {
    return new Date(timestampInMs).toLocaleDateString(locale);
  }
}
