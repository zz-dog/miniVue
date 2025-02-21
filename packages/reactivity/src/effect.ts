import type { Dep } from "./reactiveEffect";

export const effect = (fn: Function, options?) => {
  //创建一个响应式的effect，数据变化会重新执行fn
  const _effect = new ReactiveEffect(fn, () => {
    //调度器
    //调度器会在数据变化后执行fn
    _effect.run();
  });
  _effect.run(); //初始化执行一次
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};
export let activeEffect: ReactiveEffect | null;
export class ReactiveEffect {
  _trackId = 0; //用于记录当前effect执行了几次
  deps: Dep[] = [];
  _depsLength = 0; //
  _running = 0; //是否正在执行
  private active = true; //默认是激活状态
  constructor(public fn: Function, public scheduler: Function) {}
  run() {
    if (!this.active) {
      //如果不是激活状态，直接返回
      return this.fn();
    }
    let lastEffect = activeEffect;
    try {
      activeEffect = this; //确保只有执行的effect才会收集依赖
      preCleanEffect(this);
      this._running++;
      return this.fn();
    } finally {
      this._running--;
      postClearnEffect(this);

      activeEffect = lastEffect;
    }
  }
}

export const trackEffect = (effect: ReactiveEffect, dep: Dep) => {
  if (dep.get(effect) !== effect._trackId) {
    //避免重复收集
    //如果当前effect_trackId和dep中的不一样，说明是新的effect,需要收集依赖
    dep.set(effect, effect._trackId);

    //双向收集
    const oldDep = effect.deps[effect._depsLength];

    if (oldDep !== dep) {
      if (oldDep) {
        oldDep.clearup(); //清除依赖
      }
      effect.deps[effect._depsLength++] = dep;
    } else {
      effect._depsLength++;
    }
  }
};

export const triggerEffect = (dep: Dep) => {
  //触发更新
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      if (effect._running === 0) {
        //如果effect没有在执行，直接执行
        effect.scheduler();
      }
    }
  }
};

const preCleanEffect = (effect: ReactiveEffect) => {
  effect._depsLength = 0; //每次执行都会清空
  effect._trackId++; //每次执行都会自增
};

const postClearnEffect = (effect: ReactiveEffect) => {
  if (effect.deps.length > effect._depsLength) {
    //清除多余的依赖
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      const dep = effect.deps[i];
      if (dep) {
        dep.clearup();
      }
    }
    effect.deps.length = effect._depsLength; //重置长度
  }
};
