// 找到所有出现两次的元素。你可以不用到任何额外空间并在O(n)时间复杂度内解决这个问题吗？(限时5分钟)
function twoTimes(arr) {
  arr.sort((a, b) => {
    return a - b;
  });
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] != arr[i + 1]) {
      arr.splice(i, 1);
      i = i - 1;
    }
  }
  return arr;
}

let arr = [4, 3, 2, 7, 8, 2, 3, 5, 1];
console.log(twoTimes(arr));
