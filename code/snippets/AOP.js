/**
 * AOP思想，无侵入的修改一个函数
 * before和after函数，在一个函数在另一个函数执行之前或者之后
 * 都能用到之前函数的this和arguments
 */

let before = function (func) {
    let __self = this;
    return function () {
        //func先执行
        if (func.apply(this, arguments) === false) {
            return false;
        }
        // 返回原先的this和argument和原先的函数
        return __self.apply(this, arguments);
    }
}

let after = function (func) {
    // 保存原来的函数
    let __self = this;
    return function () {
        let ret = __self.apply(this, arguments);
        if (ret === false) {
            return false;
        }
        // 入侵函数运行
        func.apply(this, arguments);
        // 返回的是原来函数运行的结果
        return ret;
    }
}
/**
 * 分离表单请求和校验
 * 应该把校验规则用策略模式放到集合
 * 返回布尔值来决定是否通过验证
 */
let validator_rules = {
    not_empty: function (value) {
        return value.length !== '';
    },
    max_length: function (value) {
        return value.length > length;
    }
}
let validator = function () {
    for (let i in validator_rules) {
        if (validator_rules.apply(this, arguments) === false) {
            return false;
        }
    }
}
//send1->校验和发送写在一起
let send = function (value) {
    if (validator(value) === false) {
        return;
    }
    form.send();
}
//send2->用before把校验插入
let send2 = function (value) {
    form.send();
}
send = send.before(validator);
