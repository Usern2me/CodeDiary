// 递归
function hasPathSum(root, sum) {
  if (root.null) return null;
  // 结束条件
  if (root.left == null && root.right == null) {
    return sum === root.val;
  }
  return (
    hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - val)
  );
}

// 动态规划
let memo;
const rob = function (nums) {
  memo = new Array(nums - 1).fill(-1);
  return dp(nums, 0);
};
function dp(nums, start) {
  if (start >= nums.length) return 0;
  if (memo[start] != -1) return memo[start];

  let res = Math.max(dp(nums, start + 1), nums[start] + dp(nums, start + 2));
  memo[start] = res;
  return res;
}

//回溯
function combinationSum(arr, target) {
  let n = arr.length,
    res = [],
    tmp = [];
  function backtrack(temp, target, start) {
    if (target < 0) {
      return;
    }
    if (target == 0) {
      res.push(temp);
      return;
    }
    for (let i = start; i < n; i++) {
      temp.push(arr[i]);
      backtrack(temp.slice(), target - arr[i], i);
      temp.pop();
    }
  }
  backtrack(tmp, target, 0);
  return res;
}
