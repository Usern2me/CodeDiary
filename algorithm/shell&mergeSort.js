/**
 * 希尔排序
 * 有步长的插入排序
 */
function shellSort(arr) {
    let len = arr.length;
    let temp, gap = 1;
    //确定步长
    while (gap < len / 3) {
        gap = gap * 3 + 1;
    }
    while (gap >= 1) {
        for (let i = gap; i < len; i++) {
            temp = arr[i];
            for (let j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
                arr[j + gap] = arr[j];
            }
            arr[j + gap] = temp;
        }
        //重置步长
        gap = (gap - 1) / 3;
    }
    return arr;
}


/**
 * 归并排序
 * 分治法，稳定，将有序的子序列合并
 */
function mergeSort(arr) {
    let len = arr.length;
    if (len < 2) {
        return arr;
    }
    let middle = Math.floor(len / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
        // console.log(result);
    }
    while (left.length) {
        result.push(left.shift());
    }
    while (right.length) {
        result.push(right.shift());
    }
    return result;
}
var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(mergeSort(arr));
