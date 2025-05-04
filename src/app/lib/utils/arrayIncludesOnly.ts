const arrayIncludesOnly = (arr: string[], allowedValues: string[]) => {
  const sortedArr = arr.slice().sort();
  const sortedAllowedValues = allowedValues.slice().sort();

  return (
    sortedArr.length === sortedAllowedValues.length &&
    sortedArr.join(",") === sortedAllowedValues.join(",")
  );
};

export { arrayIncludesOnly };
