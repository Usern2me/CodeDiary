// throttle 1秒内只能发一次请求
function throttle(fun, time) {
    let flag = true
    return function () {
        if (!flag) return;
        flag = false
        setTimeout(() => {
            fun.apply(this, arguments)
            flag = true
        }, time)
    }
}

// debounce 等1s后才能发第二个请求
function debounce(fun, time) {
    let timeout = null
    return function () {
        clearTimeout(timeout)
        setTimeout(() => {
            fun.apply(this, arguments)
        }, time)
    }
}

// promise
class myPromise{
    constructor(executor) {
        this.promiseStatus = PENDING
        this.promiseValue
        this.execute(executor)
    }
    execute(executor) {
        try {
            this.execute(value => {
                this.promiseStatus = FULLFILLED
                this.promiseValue=value
            }, value => {
                    this.promiseStatus = REJECTED
                    this.promiseValue=value
            })
        } catch (e) {
            this.promiseStatus = REJECTED
            this.promiseValue=e
        }
    }
    then(onfullfilled, onrejected) {
        let ref = null
        let res = new myPromise(() => { })
        let timer = setInterval(() => {
            clearInterval(timer)
            try {
                if (this.promiseStatus == FULLFILLED) {
                    ref=onfullfilled(this.promiseValue)
                } else {
                    ref=onrejected(this.promiseValue)
                }
                if (ref instanceof myPromise) {
                    timer = setInterval(() => {
                        if (ref.promiseStatus == FULLFILLED ||
                            ref.promiseStatus == REJECTED) {
                            clearInterval(timer)
                            res.promiseStatus = ref.promiseStatus
                            res.promiseValue=ref.promiseValue
                            }
                    },0)
                } else {
                    res.promiseStatus = FULLFILLED
                    res.promiseValue=ref
                }
             } catch (e) {
                res.promiseStatus = REJECTED
                res.promiseValue=e
            }
        })
    }
}
//call
Function.prototype.call2 = function (context, ...args) {
    context.fn = this
    let res = context.fn(...args)
    delete context.fn()
    return res
}

// bind
Function.prototype.bind2 = function (context) {
    let that = this,
        // 删除arg的第一个参数
    args=Array.prototype.slice.apply(arguments,[1])
    let res = function () {
        return that.apply(context,
            args.concat(Array.prototype.slice.apply(arguments, [0])))
        // 上面是把之前的参数和新生成的函数的参数一起执行
    }
    return res
}
// 深比较
function deepCompare(x, y) {
    let p
    if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) {
        return true
    }
    if (x === y) return true
    // 基本类型和reg,function,string,number，如果类型相同比较toString()
    if (typeof x === 'function' && typeof y === 'function') {
        if ((x instanceof RegExp && y instanceof RegExp) ||
    (x instanceof String || y instanceof String) ||
    (x instanceof Number || y instanceof Number)) {
      return x.toString() === y.toString()
    } else {
      return false
    }
    }
    if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime()
      }
    
      if (!(x instanceof Object && y instanceof Object)) {
        return false
      }
    
      if (x.prototype !== y.prototype) {
        return false
      }
    
      if (x.constructor !== y.constructor) {
        return false
    }
    for (p in y) {
        if (!x.hasOwnProperty(p)) {
          return false
        }
      }
    
      for (p in x) {
        if (!y.hasOwnProperty(p)) {
          return false
        }
    
        if (typeof y[p] !== typeof x[p]) {
          return false
        }
    
        if (!compare(x[p], y[p])) {
          return false
        }
      }
      return true
}

// fun(1).add(1).min(2).num // 最终输出为 -2
function add(num) {
    this.num = num;
    this.add = function(num){
        this.num+=num;
        return this; // 核心
    }
    this.min = function (num){
        this.num-=num;
        return this; // 核心
    }
}
