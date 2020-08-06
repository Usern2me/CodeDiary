/**
 * bind方法和call方法的实现
 */

//call的实现：a.call(b,arg1,arg2)
//在b上面挂载个a方法，用的是b的作用域，a的方法，用完之后删掉
Function.prototype.call2 = function (context, ...args) {
  let context = context || window;
  context.fn = this;

  let result = context.fn(...args);
  delete context.fn();
  return result;
};

//bind的实现
//bind会创建一个新函数，第一个参数是运行时的this
//bind生成的函数作为构造函数时this不是原来指定的this
Function.prototype.bind2 = function (context) {
  let self = this;
  let args = Array.prototype.slice.call(this.arguments, 1);

  let fNOP = function () {}; //中间空函数，传递原型链用

  let fbound = function () {
    //这里的arguments是指bind返回的函数所传进来的参数
    let bindArgs = Array.prototype.slice.call(arguments);
    //构造函数时，this指向实例，self指向绑定函数
    //普通函数时，this指向window，self指向绑定函数
    self.apply(this instanceof self ? this : context, args.concat(bindArgs));
  };
  fNOP.prototype = this.prototype;
  fbound.prototype = new fNOP();
  return fbound;
};

Function.prototype.myBind = function (context) {
  const args = Array.prototype.slice(arguments, 1);
  const F = function () {};
  const self = this;
  const bound = function () {
    const innerArgs = Array.prototype.slice.call(arguments);
    const finalArgs = args.concat(innerArgs);
    return self.apply(this instanceof F ? this : context, finalArgs);
  };
  F.prototype = self.prototype;
  bound.prototype = new F();
  return bound;
};

Function.prototype.bind = function () {
  var thatFunc = this,
    thatArg = arguments[0];
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);

  return function () {
    var funcArgs = args.concat(slice.call(arguments));
    return thatFunc.apply(thatArg, funcArgs);
  };
};
