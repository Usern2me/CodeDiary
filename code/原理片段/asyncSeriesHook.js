class AsyncSeriesHook_MY {
  constructor() {
    this.hooks = [];
  }

  tapAsync(name, fn) {
    this.hooks.push(fn);
  }

  callAsync() {
    var slef = this;
    var args = Array.from(arguments);
    let done = args.pop();
    let idx = 0;

    function next(err) {
      // 如果next的参数有值，就直接跳跃到 执行callAsync的回调函数
      if (err) return done(err);
      let fn = slef.hooks[idx++];
      fn ? fn(...args, next) : done();
    }
    next();
  }
}

class AsyncSeriesWaterfallHook_MY {
  constructor() {
    this.hooks = [];
  }

  tapAsync(name, fn) {
    this.hooks.push(fn);
  }

  callAsync() {
    let self = this;
    var args = Array.from(arguments);

    let done = args.pop();
    console.log(args);
    let idx = 0;

    function next(err, data) {
      if (idx >= self.hooks.length) return done();
      if (err) {
        return done(err);
      }
      let fn = self.hooks[idx++];
      if (idx == 1) {
        fn(...args, next);
      } else {
        fn(data, next);
      }
    }
    next();
  }
}
