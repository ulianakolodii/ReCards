export const toggleQuery = (value, name = "tag") => {
  const currentSearch = new URLSearchParams(window.location.search);
  const entries = Array.from(currentSearch.entries());
  const entriesWithoutEl = entries.reduce((accumulator, [elName, elValue]) => {
    if (elName === name && elValue === value) {
      return accumulator;
    }
    return accumulator.concat([[elName, elValue]]);
  }, []);
  return new URLSearchParams(
    entries.length > entriesWithoutEl.length
      ? entriesWithoutEl
      : entries.concat([[name, value]])
  );
};
