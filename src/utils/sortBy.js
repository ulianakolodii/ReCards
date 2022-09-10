import { compare } from "./compare";

export const sortBy = (order, orderBy) => (a, b) => {
  if (order) {
    return compare(b?.[orderBy], a?.[orderBy]);
  }
  return compare(a?.[orderBy], b?.[orderBy]);
};
