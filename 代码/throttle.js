/**
 * 节流函数 持续触发的时候 每n秒执行一次函数，以第一次执行的为准
 * 所以写起来就是设置一个定时器，如果到时间就重新设置一个，没到就不触发操作
 * 使用场景：页面滚动的时候，每1s加载一下剩余的页面
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
    return throttle
}
