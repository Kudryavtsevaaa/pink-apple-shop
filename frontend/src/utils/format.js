export function formatPrice(value) {
  return `${Number(value).toLocaleString('ru-RU')} руб.`;
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString('ru-RU');
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString('ru-RU');
}
