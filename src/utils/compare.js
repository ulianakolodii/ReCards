export const compare = (a, b) => {
  const aNumber = parseFloat(a);
  const bNumber = parseFloat(b);
  if (isNaN(aNumber) || isNaN(bNumber)) {
    return (a || "").localeCompare(b || "");
  }
  return bNumber - aNumber;
};
