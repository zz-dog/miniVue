import {
  currentInstance,
  setCurrentInstance,
  unsetCurrentInstance,
} from "./component";
export enum Lifecycles {
  BEFORE_MOUNT = "bm",
  MOUNTED = "m",
  BEFORE_UPDATE = "bu",
  UPDATED = "u",
  BEFORE_UNMOUNT = "bum",
  UNMOUNTED = "um",
}

export const createHook = (lifecycle: Lifecycles) => {
  //将当前组件实例的生命周期钩子存储起来
  return (hook: Function, target = currentInstance) => {
    if (target) {
      //当前钩子在组件中运行
      const hooks: Function[] = target[lifecycle] || (target[lifecycle] = []);
      const wrapHook = () => {
        setCurrentInstance(target);
        hook.call(target);
        unsetCurrentInstance();
      }; //包装一下，保证在执行钩子时，currentInstance正确
      hooks.push(wrapHook);
    }
  };
};

export const invokeHooks = (fns: Function[]) => {
  fns.forEach((fn) => fn());
};
export const onBeforeMount = createHook(Lifecycles.BEFORE_MOUNT);
export const onMounted = createHook(Lifecycles.MOUNTED);
export const onBeforeUpdate = createHook(Lifecycles.BEFORE_UPDATE);
export const onUpdated = createHook(Lifecycles.UPDATED);
export const onBeforeUnmount = createHook(Lifecycles.BEFORE_UNMOUNT);
export const onUnmounted = createHook(Lifecycles.UNMOUNTED);
