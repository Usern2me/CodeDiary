/** 汇总js的设计模式 */

//单例模式 惰性
let single = function (fn) {
    let res
    return function () {
        return res || (res = fn.apply(this, arguments))
    }
}

// 策略模式 -> 定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换
let catetory = function () {
    var strategies = {
        "S": function (salary) {
            return salary * 4;
        },
        "A": function (salary) {
            return salary * 3;
        },
        "B": function (salary) {
            return salary * 2;
        }
    };
    var calculateBonus = function (level, salary) {
        return strategies[level](salary);
    };
    console.log(calculateBonus('S', 20000)); // 输出:80000
    console.log(calculateBonus('A', 10000)); // 输出:30000
}

// 代理模式
// 为一个对象提供一个代用品或占位符，以便控制对它的访问(图片懒加载)
var myImage = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function (src) {
            imgNode.src = src;
        }
    }
})();
var proxyImage = (function () {
    var img = new Image;
    img.onload = function () {
        myImage.setSrc(this.src);
    }
    return {
        setSrc: function (src) {
            myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif');
            img.src = src;
        }
    }
})();
proxyImage.setSrc('http://imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg')

//观察者模式
var DEvent = (function () {
    var clientList = {},
        listen,
        trigger,
        remove;
    listen = function (key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };
    trigger = function () {
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (let index = 0; index < fns.length; index++) {
            const fn = fns[index];
            fn.apply(this, arguments);
        }
    };
    remove = function (key, fn) {
        var fns = clientList[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var l = fn.length - 1; l > 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1);
                }
            }
        }
    };
    return {
        listen,
        trigger,
        remove
    };
})();
Event.listen('squareMeter88', function (price) { // 小红订阅消息
    console.log('价格= ' + price); // 输出:'价格=2000000'
});
Event.trigger('squareMeter88', 2000000); // 售楼处发布消息

// 用AOP实现职责链
Function.prototype.after = function (fn) {
    var self = this
    return function () {
        var ret = self.apply(this, arguments)
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments)
        }
        return ret
    }
};
var order = order500yuan.after(order200yuan).after(orderNormal);
order(1, true, 500); // 输出:500 元定金预购，得到 100 优惠券 
order(2, true, 500); // 输出:200 元定金预购，得到 50 优惠券 
order(1, false, 500); // 输出:普通购买，无优惠券

// 代理模式的目的是，当直接访问本体不方便或者不符合需要时，
// 为这个本体提供一个替代者。本体定义了关键功能，
// 而代理提供或拒绝对它的访问，或者在访问本体之前做一些额外的事情。
// 装饰者模式的作用就是为对象动态加入行为。

// AOP装饰者模式
Function.prototype.before = function (beforefn) {
    var __self = this; // 保存原函数的引用
    return function () { // 返回包含了原函数和新函数的"代理"函数
        beforefn.apply(this, arguments); // 执行新函数，且保证 this 不被劫持，新函数接受的参数 // 也会被原封不动地传入原函数，新函数在原函数之前执行
        return __self.apply(this, arguments); // 执行原函数并返回原函数的执行结果，  // 并且保证 this 不被劫持
    }
}
Function.prototype.after = function (afterfn) {
    var __self = this;
    return function () {
        var ret = __self.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};

// 其他设计模式->状态模式，适配器模式，中介者模式，享元模式，命令模式
