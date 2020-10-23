// 二分查找
function binarySearch(arr, n) {
  let low = 0,
    high = arr.length - 1;
  while (low <= high) {
    let mid = low + (high - low) / 2;
    if (n == arr[mid]) {
      return mid;
    } else if (n < arr[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return -1;
}

const arr = [1, 4, 5, 7, 9, 10, 20];
console.log(binarySearch(arr, 10));
