export function truncateText(
  text: string,
  maxLength = 120
) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}