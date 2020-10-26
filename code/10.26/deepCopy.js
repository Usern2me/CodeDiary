function deepCopy(obj) {
  if (typeof obj !== "object") return;
  const result = obj instanceof Array ? [] : {};
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] =
        typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
    }
  }
  return result;
}
