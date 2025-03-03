const nodeOps = {
  insert(
    el: HTMLElement,
    parent: HTMLElement,
    anchor: HTMLElement | null = null
  ) {
    //如果anchor为null，则表示插入到最后
    parent.insertBefore(el, anchor || null);
  },
  remove(el: HTMLElement) {
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
  createElement(type: string) {
    return document.createElement(type);
  },
  setElementText(el: HTMLElement, text: string) {
    el.textContent = text;
  },
  createText(text: string) {
    return document.createTextNode(text);
  },
  setText(node: Text, text: string) {
    node.nodeValue = text;
  },
  parentNode(node: Node) {
    return node.parentNode;
  },
  nextSibling(node: Node) {
    return node.nextSibling;
  },
};

export { nodeOps };
