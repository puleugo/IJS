export function removeEscapeCharacters(
  inputText: string,
  searchValue: string,
): string {
  const escapedSearchValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearchValue, 'g');
  return inputText.replace(regex, '');
}
