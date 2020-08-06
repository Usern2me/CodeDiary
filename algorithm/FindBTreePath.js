/**
 * 输入一颗二叉树的根节点和一个整数，打印出二叉树中结点值的和为输入整数的所有路径。
 * 路径定义为从树的根结点开始往下一直到叶结点所经过的结点形成一条路径。
 * (注意: 在返回值的list中，数组长度大的数组靠前)
 */
class TreeNode {
    constructor(x, left, right) {
        this.val = x;
        this.left = left || null;
        this.right = right || null;
    }
}
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
function FindPath(root, expectNumber) {
    // write code here
    let res = [];
    if (root == null) return res;
    dfsFind(root, expectNumber, [], 0, res);
    return res;
}

function dfsFind(root, expectNumber, path, currentSum, result) {
    currentSum += root.val;
    path.push(root.val);
    if (currentSum == expectNumber && root.left == null && root.right == null) {
        result.push(path.slice(0));
    }
    if (root.left != null) {
        dfsFind(root.left, expectNumber, path, currentSum, result);
    }
    if (root.right != null) {
        dfsFind(root.right, expectNumber, path, currentSum, result);
    }
    path.pop();
}

function searchBTree(root) {
    if (root == null) return;
    console.log('node->', root);
    searchBTree(root.left);
    searchBTree(root.right);
}

let b2 = new TreeNode(13)
let b1 = new TreeNode(12, b2)
let b = new TreeNode(11, null, b1)
let a9 = new TreeNode(10)
let a8 = new TreeNode(9)
let a7 = new TreeNode(8, a8, a9);
let a6 = new TreeNode(7, a7);
let a5 = new TreeNode(6);
let a4 = new TreeNode(5);
let a3 = new TreeNode(4, a4, a5);
let a2 = new TreeNode(3, a6, b);
let a1 = new TreeNode(2, a3);
let a = new TreeNode(1, a1, a2);

console.log(FindPath(a, 13));
//searchBTree(a);
