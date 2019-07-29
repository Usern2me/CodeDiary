/**
 * 输出所有可能的字符串排列
 * 回溯算法
 */
function Permutation(str) {
    result = []
    if (str.length <= 0) return result;
    var sortTmp = "";
    var arr = str.split("");
    result = sortString(arr, sortTmp)
    return result;
}

function sortString(arr, sortTmp) {
    if (arr.length == 0) {
        result.push(sortTmp);
    } else {
        var isRepeated = {}
        for (var i = 0; i < arr.length; i++) {
            if (!isRepeated[arr[i]]) {
                var p = arr.splice(i, 1)[0];
                sortTmp += p;
                console.log('sortTmp->' + sortTmp + '  i->' + i + '  p->' + p);
                sortString(arr, sortTmp);
                arr.splice(i, 0, p); //恢复字符串
                sortTmp = sortTmp.slice(0, sortTmp.length - 1);
                isRepeated[p] = true;
            }
        }
    }
    return result;
}
//console.log(Permutation('abc'));
Permutation('abc');
