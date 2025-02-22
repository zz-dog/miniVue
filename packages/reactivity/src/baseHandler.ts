import { isObject } from "@vue/shared";
import { reactive } from "./reactive";
import { track, trigger } from "./reactiveEffect";
import { ReactiveFlags } from "./constants";
export const mutableHandlers: ProxyHandler<object> = {
  get(target, key, receiver) {
    //如果是代理标识，返回true
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    //依赖收集
    track(target, key as string);

    const res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      //如果是对象，递归代理
      return reactive(res);
    }
    return res;
  },
  set(target, key, value, receiver) {
    let oldValue = target[key as string];
    let result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      //触发更新
      trigger(target, key as string, value, oldValue);
    }
    return result;
  },
};
