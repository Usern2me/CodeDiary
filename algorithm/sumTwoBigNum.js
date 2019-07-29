// 两个很大的数相加 传入的是字符串 最后输出字符串
function sumTwoBigNum(a, b) {
    let num1 = a.split('').reverse()
    let num2 = b.split('').reverse()
    let result = []
    let length = num1.length > num2.length ? num2.length : num1.length
    let flag = 0
    for (let i = 0; i < length; i++) {
        let res = flag === 0 ? (parseInt(num1[i]) + parseInt(num2[i])) : (parseInt(num1[i]) + parseInt(num2[i]) + 1)
        console.log(res)
        if (res >= 10) {
            res = res - 10
            flag = 1
        } else {
            flag = 0
        }
        result.push(res)
    }
    return result.reverse().join('')
}

console.log(sumTwoBigNum('467', '357'))
