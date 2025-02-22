import { activeEffect, trackEffect, triggerEffect } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";

export const ref = (raw) => {
  return createRef(raw);
};
export const shallowRef = (raw) => {
  return createRef(raw, true);
};
const createRef = (raw, Shallow = false) => {
  return new RefImpl(raw);
};

class RefImpl {
  __v_isRef = true; //标识是ref
  _value; //用于保存值ref的值
  dep; //用于收集依赖
  constructor(private rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this._value) {
      //如果新值和旧值不一样，更新值
      this.rawValue = newValue;
      this._value = newValue;
      triggerRefValue(this);
    }
  }
}

const trackRefValue = (ref: RefImpl) => {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      (ref.dep = createDep(() => {
        ref.dep = undefined;
      }, undefined))
    );
    console.log("ref", ref);
  }
};
const triggerRefValue = (Ref: RefImpl) => {
  let dep = Ref.dep;
  if (dep) {
    triggerEffect(dep);
  }
};
