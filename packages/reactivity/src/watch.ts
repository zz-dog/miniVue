import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";
export const watch = (
  sourch,
  cb,
  options = {
    deep: false,
    immediate: false,
  }
) => {
  return doWatch(sourch, cb, options);
};

export const watchEffect = (
  getter,
  options = {
    deep: false,
    immediate: false,
  }
) => {
  return doWatch(getter, null, options);
};

const traverse = (source, depth, currentDeoth = 0, seen = new Set()) => {
  if (!isObject(source)) {
    return source;
  }
  if (depth) {
    if (currentDeoth > depth) {
      return source;
    }
    currentDeoth++;
  }
  if (seen.has(source)) {
    return source;
  }
  for (let key in source) {
    //访问对象的每一个属性，以实现依赖收集
    traverse(source[key], depth, currentDeoth, seen);
  }
};
const doWatch = (source, cb, { deep, immediate }) => {
  const reactiveGetter = (source) =>
    traverse(source, deep === false ? 1 : undefined);
  let getter;
  if (isReactive(source)) {
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => source.value;
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;
  const job = () => {
    if (cb) {
      const newValue = effect.run();
      cb(newValue, oldValue);
      oldValue = newValue;
    } else {
      effect.run();
    }
  };
  const effect = new ReactiveEffect(getter, job);
  if (cb) {
    //watch
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else {
    //eatchEffect 相当于reactiveEffect
    //直接执行
    effect.run();
  }
  return effect.stop.bind(effect);
};
