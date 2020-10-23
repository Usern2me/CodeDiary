// 实现call和apply
function call(context, ...args) {
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
}

function apply(context, ...args) {
  context.fn = this;
  let result = context.fn(...args);
  delete context.fn;
  return result;
}

// 实现bind 返回一个带有新的context的函数
Function.prototype.bindFn = function (fn, ...args) {
  let self = this;
  return function (...fnArgs) {
    return self.apply(fn, args.concat(fnArgs));
  };
};



var obj = {
  name: "若川",
};
function original(a, b) {
  console.log(this.name);
  console.log([a, b]);
}
var bound = original.bindFn(obj, 1);
bound(2); // '若川', [1, 2]
