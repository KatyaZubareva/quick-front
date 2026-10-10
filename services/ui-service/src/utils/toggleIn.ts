export const toggleIn = (list: string[], item: string) =>
  list.includes(item) ? list.filter((f) => f !== item) : [...list, item];
