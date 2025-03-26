export const KeepAlive = {
  __isKeepAlive: true, //是否是KeepAlive组件
  setup(props, { slots }) {
    const vnode = slots.default(); //获取插槽内容
    return () => vnode; //返回插槽内容
  },
};
