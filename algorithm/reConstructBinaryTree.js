function reConstructBinaryTree(pre, vin)
{
        if(pre.length==0||vin.length==0){
                return null;
        };
        //前序第一个为根节点 也是中序左右子树的分割点
        var index=vin.indexOf(pre[0]);
        var left=vin.slice(0,index);//中序左子树
        var right=vin.slice(index+1);//中序右子树
        return {
            val:pre[0],
            //递归左右子树的前序，中序
            left:reConstructBinaryTree(pre.slice(1,index+1),left),
            right:reConstructBinaryTree(pre.slice(index+1),right)
        };
}