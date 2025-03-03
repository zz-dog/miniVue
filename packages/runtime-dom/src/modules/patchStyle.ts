export const patchStyle = (
  el: HTMLElement,
  preValue: CSSStyleDeclaration,
  nextValue: CSSStyleDeclaration
) => {
  let style = el.style;
  for (let key in nextValue) {
    style[key] = nextValue[key]; //新样式全部生效
  }
  for (let key in preValue) {
    //如果旧样式在新样式中不存在，则移除
    if (!nextValue[key]) {
      style[key] = null;
    }
  }
};
