import { ShapeFlags, getSequence } from "@vue/shared";
import { isSameVnode } from "./createVnode";
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
  const processElelment = (n1, n2, container, anchor) => {
    if (n1 == null) {
      //n1不存在，说明是初次渲染
      mount(n2, container, anchor);
    } else {
      //更新
      patchElement(n1, n2, container);
    }
  };
  //渲染更新走这里
  const patch = (n1, n2, container, anchor = null) => {
    if (n1 == n2) {
      //两次虚拟节点相同，不需要更新
      return;
    }

    //不是同一个虚拟节点
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      mount(n2, container, anchor);
    }
    processElelment(n1, n2, container, anchor);
  };
  //多次调用render会对虚拟节点进行比对，更新
  const render = (vnode, container) => {
    if (vnode == null && container._vnode) {
      //vnode不存在，清空容器
      unmount(container._vnode);
      return;
    }
    patch(container._vnode || null, vnode, container);
    //将最新的虚拟节点挂载到容器上
    container._vnode = vnode;
  };
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  };
  const mount = (vnode, container, anchor) => {
    const { type, children, props } = vnode;
    let el = hostCreateElement(type);

    vnode.el = el; //将真实节点挂载到虚拟节点上
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
      mountChildren(children, el);
    }
    //挂载到容器
    hostInsert(el, container, anchor);
  };
  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };
  const patchElement = (n1, n2, container) => {
    let el = (n2.el = n1.el);
    let oldProps = n1.props || {};
    let newProps = n2.props || {};
    patchProps(el, oldProps, newProps);
    patchChildren(n1, n2, el);
  };
  //对比属性
  const patchProps = (el, oldProps, newProps) => {
    //对比属性
    for (let key in newProps) {
      const prev = oldProps[key];
      const next = newProps[key];
      if (prev !== next) {
        hostPatchProp(el, key, prev, next);
      }
    }
    //删除旧属性
    for (let key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };
  //对比子节点
  const patchChildren = (n1, n2, container) => {
    const c1 = n1.children;
    const c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    //目前是文本节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //之前是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //删除之前的子节点
        unmountChildren(c1);
      }
      if (c2 !== c1) {
        //更新文本节点
        hostSetElementText(n2.el, c2);
      }
    }
    //目前是数组节点
    else {
      //之前是数组节点
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //全量diff,两个数组的比对
        patchKeyedChildren(c1, c2, container);
      }
      //之前是文本节点或为空
      else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          //删除之前的文本节点
          hostSetElementText(n1.el, "");
        }
        //挂载新的子节点
        mountChildren(c2, n2.el);
      }
    }
  };
  //对比数组vnode节点
  const patchKeyedChildren = (c1, c2, el) => {
    let i = 0; //开始对比的索引
    let e1 = c1.length - 1; //旧节点的结束索引
    let e2 = c2.length - 1; //新节点的结束索引
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVnode(n1, n2)) {
        //是同一个节点，递归对比
        patch(n1, n2, el);
      } else {
        //不是同一个节点，跳出循环
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVnode(n1, n2)) {
        //是同一个节点，递归对比
        patch(n1, n2, el);
      } else {
        //不是同一个节点，跳出循环
        break;
      }
      e1--;
      e2--;
    }
    //旧节点比对完，新节点有剩余，挂载新节点
    if (i > e1) {
      //说明有插入的部分，头部插入/尾部插入
      if (i <= e2) {
        let nestPos = e2 + 1;
        let anchor = c2[nestPos]?.el;
        while (i <= e2) {
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      if (i <= e1) {
        //删除部分
        while (i <= e1) {
          unmount(c1[i]);
          i++;
        }
      }
    } else {
      //对特殊情况处理
      // abcdefg
      // abdecfg
      let s1 = i;
      let s2 = i;
      let toBePatched = e2 - s2 + 1; //新节点数量
      let newIndexTOOldIndexMap = new Array(toBePatched).fill(0); //新索引对应旧索引的映射表,默认值为0
      const keyToNewIndexMap = new Map(); //做一个映射表，记录新节点的key和索引的关系
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        const newIndex = keyToNewIndexMap.get(prevChild.key);
        if (newIndex == undefined) {
          //说明旧节点在新节点中不存在，删除
          unmount(prevChild);
        } else {
          //说明新节点存在，递归对比
          newIndexTOOldIndexMap[newIndex - s2] = i + 1; //新索引对应旧索引
          patch(prevChild, c2[newIndex], el);
        }
      }
      let sequence = getSequence(newIndexTOOldIndexMap) as number[]; //获取最长递增子序列
      let j = sequence.length - 1;

      //调整位置并插入新元素
      //倒叙插入
      for (let i = toBePatched - 1; i >= 0; i--) {
        let newIndex = s2 + i; //新节点索引
        let anchor = c2[newIndex + 1]?.el; //下一个节点
        if (!c2[newIndex].el) {
          //新节点没有挂载
          patch(null, c2[newIndex], el, anchor);
        } else {
          console.log(j);
          //新节点已经挂载，移动位置
          if (i === sequence[j]) {
            //在最长递增子序列中，不需要移动
            j--;
          } else {
            //不在最长递增子序列中，移动位置
            hostInsert(c2[newIndex].el, el, anchor);
          }
        }
      }
    }
  };
  return {
    render,
  };
};
