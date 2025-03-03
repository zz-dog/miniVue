import { ShapeFlags } from "@vue/shared";

export const createRenderer = (renderOptions) => {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp,
  } = renderOptions;
  //渲染更新走这里
  const patch = (n1, n2, container) => {
    if (n1 == n2) {
      //两次虚拟节点相同，不需要更新
      return;
    }
    if (n1 == null) {
      //n1不存在，说明是初次渲染
      mount(n2, container);
    }
  };
  //多次调用render会对虚拟节点进行比对，更新
  const render = (vnode, container) => {
    console.log("rendering...", vnode, container);
    patch(container._vnode || null, vnode, container);
    container._vnode = vnode;
  };
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  };
  const mount = (vnode, container) => {
    const { type, children, props } = vnode;
    let el = hostCreateElement(type);
    if (props) {
      for (let key in props) {
        //对节点属性进行处理
        hostPatchProp(el, key, null, props[key]);
      }
    }
    //处理子节点
    if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //文本节点
      hostSetElementText(el, children);
    } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      //数组节点
      debugger;
      mountChildren(children, el);
    }
    //挂载到容器
    hostInsert(el, container);
  };

  return {
    render,
  };
};
