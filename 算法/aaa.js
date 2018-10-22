const n = 5, arr = [4, 1, 8, 2, 5];
function getResult(n, arr) {
    let res=0;
    let nowMin = getMin(arr);
    if (arr.length === 0) return res;
    if (nowMin !== 0) {
        res += nowMin;
        arr.forEach(v => { v -= nowMin })
         let zeroIndex = arr.indexOf(0);
        //console.log('res', res);
        return getResult(n,arr.slice(0,zeroIndex)).concat(getResult(n,arr.slice(zeroIndex+1)))   
    }
    
    
}
function getMin(a) {
    let min = a[0];
    a.map((v) => {
        if (v < min) min = v;
    })
    return min;
}
getResult(5,[4,1,8,2,5])
//console.log([1,2,3].slice([1,2,3].indexOf(2)))
//console.log(getResult())
//console.log(getMin([7,1,2,3,4]))
