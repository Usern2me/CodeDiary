/**
 * 1. new Promise时，需要传递一个 executor 执行器，执行器立刻执行
 * 2. executor 接受两个参数，分别是 resolve 和 reject
 * 3. promise 只能从 pending 到 rejected, 或者从 pending 到 fulfilled
 * 4. promise 的状态一旦确认，就不会再改变
 * 5. promise 都有 then 方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled,
 *      和 promise 失败的回调 onRejected
 * 6. 如果调用 then 时，promise已经成功，则执行 onFulfilled，并将promise的值作为参数传递进去。
 *      如果promise已经失败，那么执行 onRejected, 并将 promise 失败的原因作为参数传递进去。
 *      如果promise的状态是pending，需要将onFulfilled和onRejected函数存放起来，等待状态确定后，再依次将对应的函数执行(发布订阅)
 * 7. then 的参数 onFulfilled 和 onRejected 可以缺省
 * 8. promise 可以then多次，promise 的then 方法返回一个 promise
 * 9. 如果 then 返回的是一个结果，那么就会把这个结果作为参数，传递给下一个then的成功的回调(onFulfilled)
 * 10. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个then的失败的回调(onRejected)
 * 11.如果 then 返回的是一个promise,那么需要等这个promise，那么会等这个promise执行完，promise如果成功，
 *   就走下一个then的成功，如果失败，就走下一个then的失败
 */

class MyPromise {
  constructor(fn) {
    this.status = this.STATUS_MAP.PENDING;
    this.result = null;
    this.reason = null;

    this.onfullfilledList = []; // 成功之后的回调函数列表
    this.onRejectedList = []; // 失败的

    this.excutor(fn);
  }

  STATUS_MAP = {
    PENDING: "pending",
    REJECTED: "rejected",
    FULFILLED: "fulfilled",
  };

  resolve(value) {
    if (this.status !== this.STATUS_MAP.PENDING) return;
    this.status = this.STATUS_MAP.FULFILLED;
    this.result = value;
    this.onfullfilledList.forEach((fn) => fn());
  }
  reject(reason) {
    if (this.status !== this.STATUS_MAP.PENDING) return;
    this.status = this.STATUS_MAP.REJECTED;
    this.reason = reason;
    this.onRejectedList.forEach((fn) => fn());
  }
  excutor(fn) {
    const self = this;

    try {
      fn(this.resolve.bind(self), this.reject.bind(self));
    } catch (err) {
      this.reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      onFulfilled instanceof Function ? onFulfilled : (value) => value;
    onRejected =
      onRejected instanceof Function
        ? onRejected
        : (reason) => {
            throw reason;
          };
    const self = this;
    let promise2 = new MyPromise((resolve, reject) => {
      if (self.status === self.STATUS_MAP.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(self.result);
            self.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      } else if (self.status === self.STATUS_MAP.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(self.reason);
            self.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      } else if (self.status === self.STATUS_MAP.PENDING) {
        self.onfullfilledList.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(self.result);
              self.resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
        self.onRejectedList.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(self.reason);
              self.resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    });
    return promise2;
  }
  resolvePromise(promise2, x, resolve, reject) {
    const that = this;
    if (promise2 === x) {
      reject("循环调用");
    }
    if ((x && typeof x === "object") || typeof x === "function") {
      let used = false;
      try {
        let then = x.then;
        if (typeof then === "function") {
          then.call(
            x,
            (y) => {
              if (used) return;
              used = true;
              // 支持链式调用
              that.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (used) return;
              used = true;
              reject(r);
            }
          );
        } else {
          if (used) return;
          used = true;
          resolve(x);
        }
      } catch (err) {
        if (used) return;
        used = true;
        reject(err);
      }
    } else {
      // 普通对象比如数字或字符直接reslove
      resolve(x);
    }
  }
  finally(cb) {
    return this.then(
      (value) => {
        this.resolve(cb()).then(() => value);
      },
      (error) => {
        this.resolve(cb()).then(() => {
          throw error;
        });
      }
    );
  }
}

// test
function async1() {
  return new MyPromise((resolve, reject) => {
    console.log("async1 start");
    setTimeout(() => {
      resolve("async1 finished");
    }, 1000);
  });
}

function async2() {
  return new MyPromise((resolve, reject) => {
    console.log("async2 start");
    setTimeout(() => {
      resolve("async2 finished");
    }, 500);
  });
}

function async3() {
  return new MyPromise((resolve, reject) => {
    console.log("async3 start");
    setTimeout(() => {
      resolve("async3 finished");
    }, 2000);
  });
}

async1()
  .then((data) => {
    console.log(data);
    return async2();
  })
  .then((data) => {
    console.log(data);
    return async3();
  })
  .then((data) => {
    console.log(data);
  });
