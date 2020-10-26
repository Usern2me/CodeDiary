function myNew(Obj, ...args) {
  let child = Object.create(Obj.prototype);
  let result = Obj.apply(child, args);
  return typeof result === "object" ? result : child;
}

function extend(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
  Child.__proto__ = Parent;
}

function instanceOf(leftObj, rightObj) {
  const left = leftObj.__proto__;
  const right = rightObj.prototype;
  while (true) {
    if (left === null) return false;
    if (left === right) return true;
    left = left.__proto__;
  }
}
