import { isString, ShapeFlags } from "@vue/shared";

export const createVnode = (type, props, children?) => {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    key: props?.key, //diiff算法需要key
    el: null, //虚拟节点对应的真实节点
    shapeFlag,
  };
  if (children) {
    //判断children是文本还是数组
    if (Array.isArray(children)) {
      vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    } else {
      //文本节点
      children = String(children);
      vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
  }
  return vnode;
};

export const isVnode = (value) => {
  return value?.__v_isVnode;
};

export const isSameVnode = (n1, n2) => {
  return n1.type === n2.type && n1.key === n2.key;
};
