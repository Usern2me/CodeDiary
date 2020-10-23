function lowestCommonAncestor(root, p, q) {
  if (root == null) return null;
  if (root == p || root == q) return root;
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);
  if (left == null && right == null) return null;
  if (left != null && right != null) return root;
  return left == null ? right : left;
}
