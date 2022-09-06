export const dbArrayToObject = (items) =>
  items.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: item,
    }),
    {}
  );
