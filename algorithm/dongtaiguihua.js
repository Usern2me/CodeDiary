// 备忘录斐波那契数列
function fib(n) {
  if (n < 1) return 0;
  let helpArr = new Map();
  return helper(n, helpArr);
}

const helper = function (n, arr) {
  if (n == 1 || n == 2) return 1;
  if (arr.get(n)) return arr.get(n);
  const next = helper(n - 1, arr) + helper(n - 1, arr);
  arr.set(n, next);
  return next;
};

// console.log(fib(10));

// 背包问题
function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

let arr = [1, 2, 5];
console.log(coinChange(arr, 11));
