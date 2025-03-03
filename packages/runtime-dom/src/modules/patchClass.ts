export const patchClass = (el, value) => {
  if (value == null) {
    //如果value为null，则移除class属
    el.removeAttribute("class");
  } else {
    el.setAttribute("class", value);
  }
};
