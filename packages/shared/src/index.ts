export const isObject = (value: unknown) => {
  return typeof value === "object" && value !== null;
};

export const isFunction = (value: unknown): value is Function => {
  return typeof value === "function";
};
