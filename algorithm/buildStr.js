// 3[a2[bc2[g]]]
// 输出：abcggbcggabcggbcggabcggbcgg
function buildString(pattern) {
  let stack = [];
  let res = "";
  let tmp = "";
  for (let char of pattern) {
    if (char >= 0) {
      tmp += char;
    } else if (char === "[") {
      stack.push({ str: res, tmp: tmp });
      res = "";
      tmp = "";
    } else if (char === "]") {
      let data = stack.pop();
      res = data.str + res.repeat(data.tmp);
    } else {
      res += char;
    }
  }
  return res;
}

let str = "3[a2[bc2[g]]]";
console.log(buildString(str));
