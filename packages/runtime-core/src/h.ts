import { isObject, isString, ShapeFlags } from "@vue/shared";
import { createVnode, isVnode } from "./createVnode";
export function h(type, propsOrChildren?, children?) {
  let l = arguments.length;
  if (l === 2) {
    //类型判断
    //如果propsOrChildren是对象，并且不是数组
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        //虚拟节点
        return createVnode(type, null, [propsOrChildren]);
      } else {
        //属性
        return createVnode(type, propsOrChildren);
      }
    }
    //数组或文本
    return createVnode(type, null, propsOrChildren);
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    }
    if (l == 3 && isVnode(children)) {
      children = [children];
    }
    return createVnode(type, propsOrChildren, children);
  }
}
