import { reactive } from "@vue/reactivity";
import { hasOwn, isFunction } from "@vue/shared";
export const createComponentInstance = (vnode) => {
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
  };
  return instance;
};

export const setupComponent = (instance) => {
  const { vnode } = instance;
  initProps(instance, vnode.props);
  //初始化插槽
  const { date = () => {}, render } = vnode.type;
  if (!isFunction(date)) console.warn(`setupComponent: date is not a function`);
  instance.date = date;
  instance.date = reactive(date.call(instance.proxy));
  instance.render = render;
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

  //代理
  const publicProps = {
    $attrs: (instance) => {
      instance.attrs;
    },
  };
  instance.proxy = new Proxy(instance, {
    get(target, key, receiver) {
      const { date, props } = target;
      if (date && hasOwn(date, key)) {
        return Reflect.get(date, key, receiver);
      } else if (props && hasOwn(props, key)) {
        return Reflect.get(props, key, receiver);
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
