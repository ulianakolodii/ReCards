export const containsTags =
  (contains) =>
  ({ tags }) => {
    if (
      contains.length === 0 ||
      contains.every((id) => (tags || []).map(({ id }) => id).includes(id))
    ) {
      return true;
    }
    return false;
  };
