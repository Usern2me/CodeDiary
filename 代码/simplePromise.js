class myPromise {
    constructor(executor) {
        this._promiseStatus = myPromise.PENDING
        this._promiseValue
        this.execute(executor)
    }
    execute(executor) {
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
    then(onfullfilled, onrejected) {
        let _ref = null,
            timer = null,
            result = new myPromise(() => {})

        timer = setInterval(() => {
            if ((typeof onfullfilled == 'function' && this._promiseStatus == myPromise.FULLFILLED) ||
                (typeof onrejected == 'function' && this._promiseStatus == myPromise.REJECTED)) {
                clearInterval(timer)
                try {

                    if (this._promiseStatus == myPromise.FULLFILLED) {
                        _ref = onfullfilled(this._promiseValue)
                    } else {
                        _ref = onrejected(this._promiseValue)
                    }

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
    // 返回之前的值和错误 作为一个promise
    finally(cb) {
        let p = this.constructor;
        return this.then(
            value => p.resolve(cb()).then(() => value),
            error => p.resolve(cb()).then(() => {
                throw error;
            })
        )
    }
    // 传入一个promise数组，只有全部被resolve的时候才会是成功态，其余情况都是失败态
    // 并且后面还能接then进行链式调用
    all(promise_arr) {
        return new Promise((resolve, reject) => {
            let count = 0
            let length = promise_arr.length
            let res = [] //返回的结果
            function resolveData(index, value) {
                res[index] = value
                if (++count === length)
                    resolve(value)
            }
            for (let i = 0; i < length; i++) {
                promise_arr[i].then(v => {
                    resolveData(i, v)
                }, reject)
            }
        })
    }
    // 传入一个promise数组，返回第一个被resolve或reject的promise的值
    race(promise_arr) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promise_arr.length; i++) {
                promise_arr[i].then(resolve, reject)
            }
        })
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
