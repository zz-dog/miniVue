//获取最长递增子序列
export const getSequence = (arr) => {
  const result = [0]; //存储最长递增子序列的索引
  let p = result.slice(); //存储前驱节点
  const len = arr.length; //数组长度
  let start;
  let end;
  let middle;
  for (let i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      const resultLastIndex = result[result.length - 1]; //获取结果数组最后一位
      if (arr[resultLastIndex] < arrI) {
        //如果当前值大于结果数组最后一位的值
        p[i] = result[result.length - 1]; //前驱节点为结果数组最后一位
        result.push(i);
        continue;
      }
      start = 0;
      end = result.length - 1;
      //二分查找
      while (start < end) {
        middle = ((start + end) / 2) | 0;
        if (arr[result[middle]] < arrI) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      if (arrI < arr[result[start]]) {
        p[i] = result[start - 1]; //前驱节点为前一位
        result[start] = i; //替换索引
      }
    }
  }
  //创建一个前驱节点，进行倒叙回溯
  let l = result.length;
  let last = result[l - 1]; //最后一位索引
  while (l-- > 0) {
    result[l] = last; //倒叙存储，修改result索引数组
    last = p[last]; //倒叙回溯，修改last索引
  }

  return result;
};
