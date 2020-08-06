// 1.创建一个空对象，构造函数的this指向这个空对象
// 2.链接到之前对象的原型
// 3.执行构造函数方法，属性和方法被添加到this引用的对象之中
// 4.如果构造函数里没有其他的对象，返回this，如果有，返回构造函数中返回的对象
function _new(Parent, ...args) {
  let child = Object.create(Parent.prototype);
  let result = Parent.apply(child, args);
  return typeof result === "object" ? result : child;
}

// 用法
let Parent = function (name, age) {
  this.name = name;
  this.age = age;
};
Parent.prototype.sayName = function () {
  console.log(this.name + this.age);
};

const child = _new(Parent, "echo", 26);
child.sayName(); //'echo';
