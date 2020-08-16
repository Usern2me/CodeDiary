function extend(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
  child.__proto__ = parent;
}

function object(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
