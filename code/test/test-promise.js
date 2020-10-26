// 每隔一秒输出1,2,3
function getNumber() {
  const arr = [1, 2, 3];
  arr.reduce((pre, cur) => {
    return pre.then(() => {
      return new Promise((r) => {
        setTimeout(() => r(console.log(cur)), 1000);
      });
    });
  }, Promise.resolve());
}
// getNumber();

// 红绿灯交替亮
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}

function light(fn, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
}

function steps() {
  Promise.resolve()
    .then(() => {
      return light(red, 3000);
    })
    .then(() => {
      return light(green, 2000);
    })
    .then(() => {
      return light(yellow, 1000);
    })
    .then(() => {
      return steps();
    });
}

// steps();

// mergePromise
const time = (timer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
};
const ajax1 = () =>
  time(2000).then(() => {
    console.log(1);
    return 1;
  });
const ajax2 = () =>
  time(1000).then(() => {
    console.log(2);
    return 2;
  });
const ajax3 = () =>
  time(1000).then(() => {
    console.log(3);
    return 3;
  });

function mergePromise(arr) {
  // 在这里写代码
  let result = [];
  let promise = Promise.resolve();
  arr.forEach((fn) => {
    promise = promise.then(fn).then((res) => {
      result.push(res);
      return result;
    });
  });
  return promise;
}

mergePromise([ajax1, ajax2, ajax3]).then((data) => {
  console.log("done");
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]
