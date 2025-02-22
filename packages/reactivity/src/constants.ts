export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", //代理标识
}
export enum DirtyLevels {
  Dirty = 4, //脏数据,意味着要运算计算属性
  NoDirty = 0, //干净数据，就用上次的返回结果
}
