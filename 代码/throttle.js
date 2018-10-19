/**
 * 节流函数 持续触发的时候 每n秒执行一次函数
 * @param {*} func 
 * @param {*} wait 
 */
function throttle(func, wait) {
    let context, args, timeout, result
    let previous = 0
    let later = function () {
        previous = +new Date()
        timeout = null
        func.apply(context, args)
    }
    let throtteld = function () {
        // 隐式转换将时间对象转换成时间戳
        let now = +new Date()
        // 下次触发func的时间
        let remaining = wait - (now - previous)
        context = this
        args = arguments
        // 没有剩余时间了
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            func.apply(context, args)
        } else if (!timeout) {
            timeout = setTimeout(later, remaining)
        }
    }
    throtteld.cancel = function () {
        clearTimeout(timeout)
        previous = 0
        timeout = null
    }
    return throtteld
}
