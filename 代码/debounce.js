/**
 * 防抖函数 事件持续触发 
 * 在事件触发的时候又触发了以新的为准
 * 最后不触发的n秒后才执行
 * 先清除定时器再设置新的定时器就好
 * 使用场景：用户输入的时候，1s如果没有重新输入就发请求，如果有重新计时
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
function debounce(func, wait, immediate) {
    let timeout, result;
    let debounced = function () {
        let context = this // 保存上下文
        let args = arguments

        if (timeout) clearTimeout(timeout)
        if (immediate) {
            //如果已经执行过就不再执行
            let callNow = !timeout
            // 立即执行时取消定时器
            timeout = setTimeout(function () {
                timeout = null
            }, wait)
            if (callNow)
                result = func.apply(context, args)
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
