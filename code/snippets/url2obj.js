//获取某URL所有参数，集成一个对象
const getAllUrlQuery = (url)=> {
    let _url = url || window.location.href
    // 获取连接后面的参数，微信分享的链接可能会有编码问题，先decodeURI
    let params = decodeURI(_url).split('#')[0].split('?')
    // 如果只有一个数据，说明没有带参数
    if (params.length > 1) {
        let result = {}
        params = params[1].split('&')
        params.forEach(item=> {
            // 取出键值对
            let arr = item.split('=')
            let key = arr[0]
            let value = arr[1]
            // 如果出现大于2的数组，说明value中有 = 这个符号，需要拼接起来
            // 比如微信分享，中文参数先base64编码后有可能会出现这种情况
            if (arr.length > 2) {
                arr.splice(0, 1)
                value = arr.join('=')
            }
            // 因为直接解析为对象可能会出错，如果value是对象，需要自己用JSON.parse(str)解析
            // 同样，直接解码可能会报错，因为有些value是没有编码的，如果value是base64Encode编码的，也需要自己调用base64Decode(str)解码
            result[key] = value
        })
        return result
    }
    // 返回一个空对象
    return {}
}
