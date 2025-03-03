import { patchStyle, patchClass, patchEvent } from "./modules";
//对节点属性的操作
const patchProp = (el: HTMLElement, key: string, preValue, nextValue) => {
  if (key === "class") {
    //处理class
    return patchClass(el, nextValue);
  } else if (key === "style") {
    //处理style
    return patchStyle(el, preValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    //事件绑定
    return patchEvent(el, key, nextValue);
  }
};

export default patchProp;
