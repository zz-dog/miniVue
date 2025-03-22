import { currentInstance } from "./component";

export const provide = (key, value) => {
  if (!currentInstance) return;
  const parentProvides = currentInstance.parent?.provides;
  let provides = currentInstance.provides;
  if (parentProvides === provides) {
    // 为了避免直接修改父级的provides，这里做了一层浅拷贝
    provides = currentInstance.provides = Object.create(parentProvides);
  }
  provides[key] = value;
};

export const inject = (key, defaultValue) => {
  if (!currentInstance) return;
  const provides = currentInstance.provides;
  if (key in provides) {
    return provides[key];
  } else if (defaultValue) {
    return defaultValue;
  }
  // 如果没有默认值，直接返回undefined
};
