// 给定一个升序整型数组[0,1,2,4,5,7,13,15,16]
// 找出其中连续出现的数字区间，输出为["0->2","4->5","7","13","15->16"]

function summaryRanges(arr) {
  let res = [];
  let left = 0,
    right = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == arr[i + 1] - 1) {
      right++;
    } else {
      let str = `${arr[left]}->${arr[right]}`;
      res.push(str);
      left = i + 1;
      right = i + 1;
    }
  }
  return res;
}
console.log(summaryRanges([0, 1, 2, 4, 5, 7, 13, 15, 16]));
