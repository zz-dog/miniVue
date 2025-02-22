import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";
//用于记录代理后的缓冲对象，可以复用
const reactiveMap = new WeakMap();

export const reactive = (target: object) => {
  return createReactiveObject(target);
};

const createReactiveObject = (target: object) => {
  // 如果不是对象直接返回
  if (!isObject(target)) return target;

  //如果已经代理过了，直接返回
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) {
    return exitsProxy;
  }
  //防止重复代理
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  //创建代理对象
  const procy = new Proxy(target, mutableHandlers);
  //缓存代理对象
  reactiveMap.set(target, procy);
  return procy;
};

export const toReactive = (value) => {
  //如果是对象，代理
  return isObject(value) ? reactive(value) : value;
};
