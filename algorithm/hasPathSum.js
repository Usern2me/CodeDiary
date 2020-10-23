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

