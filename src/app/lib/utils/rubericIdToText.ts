const rubericIdToText = (ruberic: string) => {
  if (ruberic === "one-to-five") {
    return "Likert: 1 - 5";
  }
  if (ruberic === "binary") {
    return "Binary: 0 or 1";
  }
  if (ruberic === "float") {
    return "Float: 0.0 - 1.0";
  }
  throw new Error(`Invalid ruberic: ${ruberic}`);
};

export { rubericIdToText };
