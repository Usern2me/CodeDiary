const lever = 7,
    arr = [6, 4, 10];

function getResult(lever, arr) {
    let res = 0,
        list = [];
    for (let i = 0; i < arr.length; i++) {
        let flag = 0;
        let nowMax=arr[i]
        for (let j = i + 1; j < arr.length; j++) {
            nowMax = Math.max(arr[j], nowMax)
            //console.log('index->i '+arr[i]+' index->j '+arr[j]+' nowMax-> '+nowMax)
            if (nowMax <= arr[j]) {
                flag += 1;
            }
        }
        list[i] = flag + 1;
    }
    return Math.max(list);
}
function getMaxIndex(arr) {
    let max = Math.max(arr)
    return arr.indexOf(max);
}
console.log(getResult(lever, arr));

