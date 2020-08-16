function myInstanceof(obj, type) {
  const parentProto = type.prototype;
  let childProto = obj.__proto__;
  while (true) {
    if (childProto === null) return false;
    if (childProto === parentProto) return true;
    childProto = childProto.__proto__;
  }
}

// use
console.log(myInstanceof({ a: 1 }, Object)); // true
console.log(myInstanceof({ a: 1 }, Function)); // false

function myNew(ctor, ...args) {
  if (typeof ctor !== "function") return;
  let newObj = Object.create(ctor.prototype);
  newObj.prototype.constructor = newObj;
  let result = ctor.apply(newObj, args);
  if (
    (typeof result === "object" && result != null) ||
    typeof result === "function"
  ) {
    return result;
  }
  return newObj;
}
