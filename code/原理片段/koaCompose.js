function compose(middlewares) {
  return function (context, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) {
        return Promise.reject("多次调用next");
      }
      index = i;

      let fn = middlewares[i];
      if (i === middlewares.length) {
        fn = next;
      }
      if (!fn) {
        // 中间间运行完一遍
        return Promise.resolve(context);
      }
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
