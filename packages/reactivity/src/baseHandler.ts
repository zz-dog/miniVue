import { activeEffect } from "./effect"
import { track, trigger } from "./reactiveEffect"
export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive' //代理标识
}
export const mutableHandlers: ProxyHandler<object> = {
  get(target, key, receiver) {
    //如果是代理标识，返回true
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    //依赖收集
    track(target, key as string)
    return Reflect.get(target, key, receiver)



  },
  set(target, key, value, receiver) {
    let oldValue = target[key as string]
    let result = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      //触发更新
      trigger(target, key as string, value, oldValue)
    }
    return result


  }
}