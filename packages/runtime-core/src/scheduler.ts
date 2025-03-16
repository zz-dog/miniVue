const queue = []; // 任务队列
let isFlushing = false; // 是否正在刷新任务队列
const resolvePromise = Promise.resolve();

//如果同时有多个任务进入队列，只会执行一次
//同时只会执行一个异步任务
const queueJob = (job) => {
  if (!queue.includes(job)) {
    //如果任务队列中没有这个任务，就添加到任务队列中
    queue.push(job);
  }
  if (!isFlushing) {
    isFlushing = true;
    resolvePromise.then(() => {
      const copy = queue.slice(0); //复制队列
      queue.length = 0; //清空队列
      copy.forEach((job) => {
        job();
      });
      isFlushing = false;
      copy.length = 0;
    });
  }
};
export default queueJob;
