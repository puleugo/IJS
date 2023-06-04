export function getLastMondayByDate(date: Date) {
  if (date.getDay() === 0) new Date(date.setDate(date.getDate() - 6));
  return new Date(date.setDate(date.getDate() - date.getDay() + 1));
}
