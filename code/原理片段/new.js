// 1.创建一个空对象，构造函数的this指向这个空对象
// 2.链接到之前对象的原型
// 3.执行构造函数方法，属性和方法被添加到this引用的对象之中
// 4.如果构造函数里没有其他的对象，返回this，如果有，返回构造函数中返回的对象
function _new() {
    let newObj = {};
    let { constructor, ...args } = [...arguments];
    newObj.__proto__ = constructor.prototype;

    let result = constructor.apply(newObj, args);// 执行一下构造函数看有没有产生新的函数或者对象
    if (result && (typeof (result) == "object" || typeof (result) == "function")) {
        return result
    }
    return newObj
}
