export function getLastMondayByDate(date: Date) {
  return new Date(date.setDate(date.getDate() - date.getDay() + 1));
}
