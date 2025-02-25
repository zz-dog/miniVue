import { activeEffect, trackEffect, triggerEffect } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";
import { Dep } from "./reactiveEffect";
export const ref = (raw) => {
  return createRef(raw);
};
export const shallowRef = (raw) => {
  return createRef(raw, true);
};
const createRef = (raw, Shallow = false) => {
  return new RefImpl(raw);
};

export class RefImpl {
  __v_isRef = true; //标识是ref
  _value; //用于保存值ref的值
  dep: Dep; //用于收集依赖
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

export const trackRefValue = (ref: RefImpl) => {
  if (activeEffect) {
    console.log("trackRefValue", ref);
    trackEffect(
      activeEffect,
      (ref.dep =
        ref.dep ||
        createDep(() => {
          ref.dep = undefined;
        }, undefined))
    );
  }
};
export const triggerRefValue = (Ref: RefImpl) => {
  let dep = Ref.dep;
  if (dep) {
    triggerEffect(dep);
  }
};

//toRef,toRefs

export const toRef = (object, key) => {
  return new ObjectRefImpl(object, key);
};
class ObjectRefImpl {
  __v_isRef = true;
  constructor(private _object, private _key) {}
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
}

export const toRefs = (object: object, key) => {
  const res = {};
  for (let key in object) {
    res[key] = toRef(object, key);
  }
  return res;
};

export const proxyRefs = (objectWithRef) => {
  if (!objectWithRef.__v_isRef) return objectWithRef;
  return objectWithRef.value;
};
export const isRef = (value) => {
  return !!(value && value.__v_isRef);
};
