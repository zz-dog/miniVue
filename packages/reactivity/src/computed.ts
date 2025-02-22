import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { Dep } from "./reactiveEffect";
import { trackRefValue, triggerRefValue, RefImpl } from "./ref";
export const computed = (getterOrOptions) => {
  const onlyGetter = isFunction(getterOrOptions);
  let getter;
  let setter;

  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter, setter);
};

class ComputedRefImpl {
  __v_isRef = true;
  public _value;
  public effect: ReactiveEffect;
  public dep: Dep;
  constructor(getter, public setter) {
    //创建一个effect
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        triggerRefValue(this as any);
      }
    );
  }
  get value() {
    if (this.effect.dirty) {
      //如果是脏数据，重新计算
      //执行getter ,所依赖的ref/reactive会收集依赖,并接受计算结果
      this._value = this.effect.run();
      //computed触发依赖收集 effct
      trackRefValue(this as any);
    }
    //返回值
    return this._value;
  }
  set value(newValue) {
    //设置新值

    this.setter(newValue);
  }
}
