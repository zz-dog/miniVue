import { nodeOps } from "./nodeOps";
import patchProp from "./patchProp";
import { createRenderer } from "@vue/runtime-core";
const renderOptions = Object.assign({ patchProp }, nodeOps);

// render方法采用dom api 进行渲染
const render = (vnode, container) => {
  return createRenderer(renderOptions).render(vnode, container);
};
export { render };
export * from "@vue/runtime-core";
export * from "@vue/reactivity";
