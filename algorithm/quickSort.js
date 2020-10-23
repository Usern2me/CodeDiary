/**
 * 找基准，大的放左边，小的放右边
 */
// 需要额外空间
function quickSort1(arr) {
  if (arr.length < 1) return arr;
  let pivotIndex = Math.floor(arr.length / 2);
  // 把基准值从数组里去掉
  let pivot = arr.splice(pivotIndex, 1)[0];
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort1(left).concat([pivot], quickSort1(right));
}

function sort(arr) {
  if (arr.length < 1) return arr;

  let mid = Math.floor(arr.length / 2);
  let pivot = arr.splice(mid, 1)[0];
  let left = [];
  let right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return sort(left).concat([pivot], sort(right));
}

// 使用交换 不需要额外空间
function quickSort2(arr, start, end) {
  if (start > end) return;
  let i = start,
    j = end,
    pivot = arr[start]; //存放基准数
  while (i !== j) {
    // 从右边开始，找第一个小于基准的位置
    while (arr[j] >= pivot && i < j) {
      j--;
    }
    // 从左边开始，找第一个大于基准的位置
    while (arr[i] <= pivot && i < j) {
      i++;
    }
    // 交换两个数
    if (i < j) {
      let tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  }
  // 最后把基准数归位
  arr[start] = arr[i];
  arr[i] = pivot;
  console.log("start->" + arr[start] + "arr[i]->" + arr[i] + "arr->" + arr);
  // 递归处理左边
  quickSort2(arr, start, i - 1);
  // 递归处理右边
  quickSort2(arr, i + 1, end);
}

let arr = [10, 23, 2, 34, 5, 39, 20, 33];
let a = [3, 1, 2, 4, 5];
//console.log(quickSort1(arr))
console.log(sort(a, 0, a.length - 1));
