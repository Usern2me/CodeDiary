// 如果值比要进入的节点大，就去右树，比节点小，就去左树
function isInBFS(root, target) {
  if (!root) return false;
  if (root.val === target) return true;
  if (target < root.val) {
    isInBFS(root.left, target);
  } else {
    isInBFS(root.right, target);
  }
}
