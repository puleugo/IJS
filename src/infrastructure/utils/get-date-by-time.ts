export function getDateByTime(time: string): Date {
  const date = new Date();
  const hour = time.split(':')[0];
  const minute = time.split(':')[1];
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minute));
  return date;
}
