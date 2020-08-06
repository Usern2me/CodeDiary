/**
 * DFS深度优先查找
 * 栈,先入后出，递归查找节点
 * BFS广度优先查找
 * 队列,用数组模拟队列
 */
let tree = {
    value: "-",
    left: {
        value: '+',
        left: {
            value: 'a',
        },
        right: {
            value: '*',
            left: {
                value: 'b',
            },
            right: {
                value: 'c',
            }
        }
    },
    right: {
        value: '/',
        left: {
            value: 'd',
        },
        right: {
            value: 'e',
        }
    }
}
//dfs 深度 先序
let res = []
let dfs = (tree) => {
    if (tree) {
        res.push(tree.value);
        if (tree.left) dfs(tree.left);
        if (tree.right) dfs(tree.right);
    }
}
dfs(tree);
console.log('dfs->' + res);

//bfs 广度优先
let res1 = [];
let stack = [tree];
let count = 0;
let bfs = () => {
    let node = stack[count];
    if (node) {
        res1.push(node.value);
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
        count++;
        bfs();
    }
}
bfs(tree);
console.log('bfs->' + res1)
