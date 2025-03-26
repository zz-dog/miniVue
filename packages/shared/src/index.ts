export const isObject = (value: unknown) => {
  return typeof value === "object" && value !== null;
};

export const isFunction = (value: unknown): value is Function => {
  return typeof value === "function";
};

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export * from "./shapeFlages";
export * from "./sq";

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (value, key) => {
  return hasOwnProperty.call(value, key);
};

export * from "./patchFlages";
