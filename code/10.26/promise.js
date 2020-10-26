// 1. 三种状态 'pending','fullfiled','rejected'
// 2. then链式调用,返回一个新的promise实例
// 3. _handle方法用来处理回调函数
// 4. all需要一个count计数，把结果保存在一个数组里面
// 5. race只需要for异步请求，只要有一个reslove就直接resolve，更简单

class myPromise {
  state = "pending";
  callbacks = [];
  value = undefined;
  err = undefined;
  constructor(fn) {
    fn(this._resolved.bind(this), this._rejected.bind(this));
  }
  // 每个then都会返回一个新的promise以供链式调用
  then(onFullfilled, onRejected) {
    return new myPromise((resolve, reject) => {
      this._handle({
        onFullfilled: onFullfilled || null,
        onRejected: onRejected || null,
        resolve,
        reject,
      });
    });
  }
  _handle(callback) {
    if (this.state == "pending") {
      this.callbacks.push(callback);
      return;
    }
    let cb =
      this.state === "fullfiled" ? callback.onFullfilled : callback.onRejected;
    // 运行下一个的回调函数
    let ret = cb(this.value);

    // 把运行的结果传给resolve或者reject
    cb = this.state === "fullfiled" ? callback.resolve : callback.reject;
    cb(ret);
  }
  _resolved(value) {
    if (this.state === "pending") {
      if ((value && typeof value == "object") || typeof value == "function") {
        let then = value.then;
        if (typeof then == "function") {
          then.call(
            value,
            this._resolved.bind(this),
            this._rejected.bind(this)
          );
          return;
        }
      }
      this.value = value;
      this.state = "fullfiled";
      setTimeout(() => {
        this.callbacks.forEach((v) => this._handle(v));
      }, 0);
    }
  }
  _rejected(err) {
    if (this.state === "pending") {
      this.err = err;
      this.state = "rejected";
      this.callbacks.forEach((v) => this._handle(v));
    }
  }
  all(promises) {
    return new myPromise((resolve, reject) => {
      let count = 0;
      const len = promises.length;
      const rets = Array.from({ length: len });
      promises.forEach((fn, i) => {
        myPromise.resolve(fn).then(
          (res) => {
            count++;
            rets[i] = res;
            if (count == length) {
              resolve(rets);
            }
          },
          (err) => reject(err)
        );
      });
    });
  }
  race(promises) {
    return new myPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          (res) => {
            return resolve(res);
          },
          (err) => {
            return reject(err);
          }
        );
      }
    });
  }
}

// 使用
const fn = new myPromise((resolve, rejected) => {
  setTimeout(() => {
    console.log("aaa");
    resolve("aaa");
  }, 1000);
})
  .then((res) => {
    console.log("res", res);
  })
  .then((res) => {
    console.log("res2", res);
  });
