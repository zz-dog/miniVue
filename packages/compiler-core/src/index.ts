import { NodeTypes } from "./ast";

export const parse = (template) => {
  //根据模板解析成ast
  const context = createParserContext(template);
  //解析根节点
  const nodes = parserChildren(context);
  //创建根节点
  return createRoot(nodes);
};

const createParserContext = (content) => {
  return {
    originalSource: content, //原始模板
    source: content, //模板
    line: 1,
    column: 1,
    offset: 0,
  };
};

const parserChildren = (context) => {
  const nodes = [];
  while (!isEnd(context)) {
    let node;
    const c = context.source as string;
    if (c.startsWith("{{")) {
      //插值
      node = "表达式";
    } else if (c.startsWith("<")) {
      //标签
      node = parseElement(context);
    } else {
      //文本
      node = parseText(context);
    }
    if (node) nodes.push(node);
  }
  return nodes;
};

const isEnd = (contect) => {
  return !contect.source;
};
const createRoot = (children) => {
  return {
    type: NodeTypes.ROOT,
    children,
  };
};
const parseText = (context) => {
  let tokens = ["<", "{{"];

  let endIndex = context.source.length;
  for (let i = 0; i < tokens.length; i++) {
    const index = context.source.indexOf(tokens[i]);
    if (index !== -1 && index < endIndex) {
      endIndex = index; //找到最近的分隔符 < 或 {{
    }
  }

  const content = parseTextDate(context, endIndex);
  return {
    type: NodeTypes.TEXT,
    content,
  };
};
const parseElement = (context) => {
  if (!context.source) return;
  const ele = parseTag(context);

  // ele.loc = getSelection(context, ele.loc.start);
  if (context.source && ele) {
    const children = parserChildren(context);
    ele.children = children;
  }
  return ele;
};
const parseTag = (context) => {
  const isEndTag = context.source.startsWith("</"); //是否结束标签
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source);
  const tag = match[1]; //标签名
  advanceBy(context, match[0].length); //删除标签名
  advancedSpace(context); //删除空格
  const isSelfClosing = context.source.startsWith("/>"); //是否自闭合
  advanceBy(context, isSelfClosing ? 2 : 1); //删除标签结束
  if (isEndTag) return;
  return {
    type: NodeTypes.ELEMENT,
    tag,
    isSelfClosing,
    loc: getSelection(context, match.index),
    children: [],
  };
};
const parseTextDate = (context, index) => {
  const content = context.source.slice(0, index); //slice不会改变原数组
  advanceBy(context, index);
  return content;
};

const advanceBy = (context, endIndex) => {
  let c = context.source as string;
  context.source = c.slice(endIndex);
};

const advancedSpace = (context) => {
  const match = /^\s+/.exec(context.source); //匹配空格
  if (match) {
    advanceBy(context, match[0].length);
  }
};
const getSelection = (context, start) => {
  return {
    source: context.originalSource,
    start: {
      offset: start,
      line: context.line,
      column: context.column,
    },
    end: {
      offset: context.offset,
      line: context.line,
      column: context.column,
    },
  };
};
