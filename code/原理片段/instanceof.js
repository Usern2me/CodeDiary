function instanceOf(child, parent) {
  while (true) {
    if (child.__proto__ == null) return false;

    if (child.__proto__ === parent.prototype) {
      return true;
    }
    child = child.__proto__;
  }
}

console.log(instanceOf([1, 2, 3], Array));
console.log(instanceOf([], String));
