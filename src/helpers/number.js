export const isPositiveNumber = (number) => {
  return (
    typeof number === "number" &&
    number !== null &&
    isFinite(number) &&
    number > -1
  );
};
