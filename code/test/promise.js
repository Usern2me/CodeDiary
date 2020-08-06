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
