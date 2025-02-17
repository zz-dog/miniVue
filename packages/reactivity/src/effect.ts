export const effect = (fn: Function, options?) => {
  //创建一个响应式的effect，数据变化会重新执行fn
  const _effect = new ReactiveEffect(fn, () => {
    //调度器
    //调度器会在数据变化后执行fn
    _effect.run()
  })
  return _effect.run()
}
export let activeEffect: ReactiveEffect | null
export class ReactiveEffect {
  private active = true //默认是激活状态
  constructor(public fn: Function, public scheduler: Function) {

  }
  run() {
    if (!this.active) {
      //如果不是激活状态，直接返回
      return this.fn()
    }
    let lastEffect = activeEffect
    try {
      activeEffect = this
      return this.fn()
    }
    finally {
      activeEffect = lastEffect
    }

  }
}