export const hasQuery = (value, name = "tag") => {
  const currentSearch = new URLSearchParams(window.location.search);
  const entries = Array.from(currentSearch.entries());
  return !!entries.find(
    ([elName, elValue]) => elName === name && elValue === value
  );
};
