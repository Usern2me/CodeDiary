/**
 * 防抖函数 事件持续触发 但是等事件完成后n秒才执行函数
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
function debounce(func, wait, immediate) {
    let timeout, result
    let debounced = function () {
        let context = this // 保存上下文
        let args = arguments

        if (timeout) clearTimeout(timeout)
        if (immediate) {
            let callNow = !timeout
            // 立即执行时取消定时器
            timeout = setTimeout(function () {
                timeout = null
            }, wait)
            if (callNow) result = func.apply(context, args)
        } else {
            timeout = setTimeout(function () {
                result = func.apply(context, args)
            }, wait)
        }
        return result
    }
    debounced.cancel = function () {
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}
