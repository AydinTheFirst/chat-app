export function serialize(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.prototype.toString.call(value) === '[object Object]'
    ) {
      // Recursive serialize for plain objects only
      result[key] = serialize(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}
