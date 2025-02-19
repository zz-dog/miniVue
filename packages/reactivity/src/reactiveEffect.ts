import { activeEffect, trackEffect, ReactiveEffect, triggerEffect } from './effect'

export type Dep = Map<ReactiveEffect, number> & { clearup: () => void, name: string }

const targetMap = new WeakMap<object, Map<string, Dep>>() //存放依赖关系

export const createDep = (clearup, key) => {
  const dep = new Map() as Dep
  dep.clearup = clearup //用于清除依赖
  dep.name = key //用于标识是哪个属性的依赖
  return dep
}
export const track = (target: object, key: string) => {
  //activeEffect不为空，说明是effect执行的时候
  if (activeEffect) {
    // console.log('依赖收集', activeEffect, key)
    let depMap = targetMap.get(target)
    if (!depMap) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }
    let dep = depMap.get(key)
    if (!dep) {
      depMap.set(key, dep = createDep(() => { depMap.delete(key) }, key))
    }
    trackEffect(activeEffect, dep)
    console.log(targetMap)
  }
}

export const trigger = (target: object, key: string, value, oldValue) => {
  const depMap = targetMap.get(target)
  if (!depMap) return //没有依赖
  const dep = depMap.get(key)
  if (dep) {
    //触发更新
    triggerEffect(dep)

  }
}