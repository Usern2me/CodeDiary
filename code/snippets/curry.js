/**
 * 函数柯里化
 * 一个函数最好不要传超过两个参数
 */
// 实现1
function sub_curry(fn) {
  // 拿第一个参数
  var args = [].slice.call(arguments, 1);
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
}

function curry1(fn, length) {
  length = length || fn.length;
  var slice = Array.prototype.slice;
  return function () {
    if (arguments.length < length) {
      var combined = [fn].concat(slice.call(arguments));
      return curry(sub_curry.apply(this, combined), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  };
}

// 实现2
function curry2(fn, args) {
  length = fn.length;
  args = args || [];
  return function () {
    var _args = args.slice(0),
      arg,
      i;
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      _args.push(arg);
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args);
    } else {
      return fn.apply(this, _args);
    }
  };
}

// https://juejin.im/post/5bf9bb7ff265da616916e816
const curry3 = (fn, arr = []) => (...args) =>
  ((arg) => (arg.length === fn.length ? fn(...arg) : curry3(fn, arg)))([
    ...arr,
    ...args,
  ]);

var fn = curry3(function (a, b, c) {
  console.log([a, b, c]);
});

fn("a", "b", "c"); // ["a", "b", "c"]
fn("a", "b")("c"); // ["a", "b", "c"]
fn("a")("b")("c"); // ["a", "b", "c"]
fn("a")("b", "c"); // ["a", "b", "c"]
