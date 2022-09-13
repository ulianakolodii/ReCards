export const includesBy = (value = "", obj, keys = []) =>
  keys.some((key) => String(obj?.[key]).includes(value));
