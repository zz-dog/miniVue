export const patchEvent = (
  el: HTMLElement,
  name: string,
  nextValue: Function
) => {
  const invokers = (el as any)._vei || ((el as any)._vei = {}); //缓存事件
  const Eventname = name.slice(2).toLowerCase(); //去掉on前缀，并转为小写
  const exisitingInvoker = invokers[name]; //获取invoker
  if (exisitingInvoker && nextValue) {
    //如果存在invoker，并且新的value存在，则更新value
    return (exisitingInvoker.value = nextValue);
  }
  if (nextValue) {
    const invoker = (invokers[name] = createInvoker(nextValue)); //创建invoker
    el.addEventListener(Eventname, invoker); //添加事件监听
    return;
  }
  if (exisitingInvoker) {
    //如果存在invoker，并且新的value不存在，则移除事件监听
    el.removeEventListener(Eventname, exisitingInvoker);
    invokers[name] = undefined;
  }
};

const createInvoker = (value: Function) => {
  const invoker = (e) => invoker.value(e);
  invoker.value = value; //更改invoker的value属性 可以修改相应的value属性
  return invoker;
};
