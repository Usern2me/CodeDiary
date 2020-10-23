/**
 * 简单的使用es6的generator和promise实现的async/await语法糖
 * async对generator的改进：
 * 1.返回一个promise
 * 2.内置执行器，不需要手动调用next()
 * 3.await后面可以跟一个promise或原始类型
 */

// 核心函数 then之后再一直调用next 实现自动一直执行
function runner(getIterator) {
  let iterator = getIterator();

  function next(data) {
    let result = iterator.next(data);
    if (result.done) {
      return;
    }
    let promise = result.value;
    promise.then(function (data) {
      next(data);
    });
    next();
  }
}

//tj大神的co模块
function co(gen) {
  let ctx = this;
  let args = slice.call(arguments, 1);

  return new Promise(function (resolve, reject) {
    // 状态完成的处理
    function onFullfilled(res) {
      let ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next();
    }

    // 出错时的处理
    function onRejected(err) {
      let ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(e);
    }

    //generator执行器
    function next(ret) {
      if (ret.done) return resolve(ret.value);
      let value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value))
        return value.then(onFullfilled, onRejected);
      return onRejected(
        new TypeError(
          "You may only yield a function, promise, generator, array, or object, " +
            'but the following object was passed: "' +
            String(ret.value) +
            '"'
        )
      );
    }
  });
}

function simpleCo(gen) {
  let context = this;

  return new Promise((resolve, reject) => {
    function onFullfilled(res) {
      gen.next(res);
      next();
    }
    function onRejected(err) {
      gen.throw(err);
      next();
    }
    function next(ret) {
      if (ret.done) return resolve(ret.value);
      return toPromise.call(context, ret.value).then(onFullfilled, onRejected);
    }
  });
}
