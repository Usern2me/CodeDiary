/**
 * 二叉搜索树
 * 根节点下所有左节点小于根节点
 * 所有右节点大于根节点
 * 没有重复的值
 * @param {array} sequence 
 */
function VerifySquenceOfBST(sequence) {
    if (sequence.length == 0)
        return false;
    if (sequence.length == 1)
        return true;
    return help(sequence, 0, sequence.length - 1);
}

function help(a, start, root) {
    if (start >= root)
        return true;
    let i = root;
    //找到下一层根的坐标 坐标左边的数应该都比根小
    while (i > start && a[i - 1] > a[root])
        i--;
    for (let j = start; j < i - 1; j++) {
        if (a[j] > a[root])
            return false;
    }
    return help(a, start, i - 1) && help(a, i, root - 1);
}
console.log(VerifySquenceOfBST([1, 5, 4, 3, 11, 17, 15, 13, 8]));
