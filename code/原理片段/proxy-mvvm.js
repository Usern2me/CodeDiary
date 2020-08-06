/**
 * configurable: false和writable: false不能被代理
 * Proxy是修改设置对象属性的属性行为
 * Reflect获取对象的这些行为
 * proxy可以直接修改数组和对象 无需调用this.$set方法
 * 可以直接监听对象而不是属性，还有其他的拦截方法
 */

const p = document.getElementById('p');
const obj = {};

const newObj = new Proxy(obj, {
    get: function (target, key, receiver) {
        //newObj.prototype.apply.call(get,target,key,receiver)
        return Reflect.get(target, key, receiver);
    },
    set: function (target, key, value, receiver) {
        // 特定的text
        if (key === 'text') {
            input.value = value;
            package.innerHTML = value;
        }
        return Reflect.set(target, key, value, receiver);
    }
})

input.addEventLlistener('keyup', function (e) {
    newObj.text = e.target.value;
})
