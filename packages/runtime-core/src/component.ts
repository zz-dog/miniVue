import { proxyRefs, reactive } from "@vue/reactivity";
import { hasOwn, isFunction, ShapeFlags } from "@vue/shared";

export const createComponentInstance = (vnode, parentComponent) => {
  const instance = {
    date: null, //组件的数据
    vnode: vnode, //组件的虚拟节点
    subTree: null, // 组件的子节点
    isMounted: false, //是否挂载
    update: null, //更新函数
    props: {},
    attrs: {},
    component: null, //组件的实例
    propsOptions: vnode.type.props || {}, //props的配置
    proxy: null, //用来代理props和attrs,date
    setupState: {}, //setup返回的状态
    slots: {}, //插槽
    expose: {},
    parent: parentComponent,
    provides: parentComponent ? parentComponent.provides : Object.create(null),
  };
  return instance;
};

export const setupComponent = (instance) => {
  const { vnode } = instance;
  initProps(instance, vnode.props);
  initSlots(instance, vnode.children); //初始化插槽
  initProxy(instance); //初始化代理

  const { date = () => {}, render, setup } = vnode.type;
  if (setup) {
    const setupContext = {
      attrs: instance.attrs,
      props: instance.props,
      slots: instance.slots,
      emit: (event, ...play) => {
        const eventName = `on${event.replace(
          event[0],
          event[0].toUpperCase()
        )}`;
        const handler = instance.vnode.props[eventName];
        handler && handler(...play);
      },
    };
    setCurrentInstance(instance);

    const setupResult = setup(instance.props, setupContext);
    unsetCurrentInstance();
    if (isFunction(setupResult)) {
      instance.render = setupResult;
    } else {
      instance.setupState = setupResult;
    }
  }
  instance.date = date;
  instance.date = reactive(date.call(instance.proxy));
  instance.render ??= render;
};

const initProps = (instance, rawProps) => {
  const attrs = {};
  const props = {};
  const propsOptions = instance.propsOptions || {}; //组件props配置
  if (rawProps) {
    //对props和attrs进行区分
    for (let key in propsOptions) {
      const value = rawProps[key];
      if (key in propsOptions) {
        props[key] = value; //props
      } else {
        attrs[key] = value; //attrs
      }
    }
  }
  instance.props = reactive(props);
  instance.attrs = attrs;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children;
  }
};

const initProxy = (instance) => {
  //代理
  const publicProps = {
    $attrs: (instance) => {
      return instance.attrs;
    },
    $slots: (instance) => {
      return instance.slots;
    },
  };
  instance.proxy = new Proxy(instance, {
    get(target, key, receiver) {
      const { date, props, setupState } = target;
      if (date && hasOwn(date, key)) {
        return Reflect.get(date, key, receiver);
      } else if (props && hasOwn(props, key)) {
        return Reflect.get(props, key, receiver);
      } else if (setupState && hasOwn(setupState, key)) {
        const value = proxyRefs(setupState[key]);
        return value;
      }
      const getter = publicProps[key];

      if (getter) {
        return getter(instance);
      }
    },
    set(target, key, value, receiver) {
      const { date, props } = target;
      if (date && hasOwn(date, key)) {
        date[key] = value;
      } else if (props && hasOwn(props, key)) {
        console.warn(`props is readonly`);
      }
      return true;
    },
  });
};
export let currentInstance = null;
export const getCurrentInstance = () => {
  return currentInstance;
};
export const setCurrentInstance = (instance) => {
  currentInstance = instance;
};

export const unsetCurrentInstance = () => {
  currentInstance = null;
};
