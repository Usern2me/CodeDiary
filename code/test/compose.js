// 有个i计数用
// 递归出口是i == arr.length 说明next前面的流程执行完了 接下来要从里往外执行
// 开始递归
// return Promise.resolve(fn(context,dispatch.bind(null,i+1)))
function compose(middleware) {
  return function (context, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject("error");
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

const fn1 = async function (ctx, next) {
  console.log("fn1 before--->");
  await next();

  await setTimeout(() => {
    console.log("fn1 after--->");
  }, 1000);
};

const fn2 = async function (ctx, next) {
  await setTimeout(() => {
    console.log("fn2 before--->");
  }, 1000);

  await next();

  console.log("fn2 after--->");
};

const run = compose([fn1, fn2]);
run();
