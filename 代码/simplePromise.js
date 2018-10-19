class myPromise {
    constructor(executor) {
        // 私有属性
        this._promiseStatus = myPromise.PENDING
        this._promiseValue
        this.execute(executor)
    }
    // 执行器，构造时就执行
    execute(executor) {
        // executor如果不是函数抛出错误
        if (typeof executor != 'function') {
            throw new Error(`${executor} is not a function`)
        }

        try {
            this.execute(
                value => {
                    this._promiseStatus = myPromise.FULLFILLED
                    this._promiseValue = value
                }, value => {
                    this._promiseStatus = myPromise.REJECTED
                    this._promiseValue = value
                })
        } catch (e) {
            this._promiseStatus = myPromise.REJECTED
            this._promiseValue = e
        }
    }
    // then的回调是异步的
    then(onfullfilled, onrejected) {
        let _ref = null,
            timer = null,
            result = new myPromise(() => {})
        // 监听状态的改变
        timer = setInterval(() => {
            if ((typeof onfullfilled == 'function' && this._promiseStatus == myPromise.FULLFILLED) ||
                (typeof onrejected == 'function' && this._promiseStatus == myPromise.REJECTED)) {
                clearInterval(timer)
                try {
                    // 判断status
                    if (this._promiseStatus == myPromise.FULLFILLED) {
                        _ref = onfullfilled(this._promiseValue)
                    } else {
                        _ref = onrejected(this._promiseValue)
                    }
                    // 如果_ref是myPromise实例，需要返回这个实例，实现链式调用
                    if (_ref instanceof myPromise) {
                        timer = setInterval(() => {
                            if (_ref._promiseStatus == myPromise.FULLFILLED ||
                                _ref._promiseStatus == myPromise.REJECTED) {
                                clearInterval(timer)
                                result._promiseStatus = _ref._promiseStatus
                                result._promiseValue = _ref._promiseValue
                            }
                        }, 0)
                    } else {
                        result._promiseValue = _ref
                        result._promiseStatus = myPromise.FULLFILLED
                    }
                } catch (e) {
                    result._promiseStatus = myPromise.REJECTED
                    result._promiseValue = e;
                }
            }
        }, 0)
        return result
    }
}
myPromise.PENDING = 'pending'
myPromise.FULLFILLED = 'resolved'
myPromise.REJECTED = 'rejected'

function async1() {
    return new myPromise(
        (resolve, reject) => {
            console.log('async1 start');
            setTimeout(() => {
                resolve('async1 finished')
            }, 1000);
        }
    );
}

function async2() {
    return new myPromise(
        (resolve, reject) => {
            console.log('async2 start');
            setTimeout(() => {
                resolve('async2 finished')
            }, 1000);
        }
    );
}

function async3() {
    return new myPromise(
        (resolve, reject) => {
            console.log('async3 start');
            setTimeout(() => {
                resolve('async3 finished');
            }, 1000);
        }
    );
}

async1()
    .then(
        data => {
            console.log(data);
            return async2();
        })
    .then(
        data => {
            console.log(data);
            return async3();
        }
    )
    .then(
        data => {
            console.log(data);
        }
    );
