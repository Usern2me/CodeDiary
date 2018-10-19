import java.util.*;
public class TreeNode {
    int val = 0;
    TreeNode left = null;
    TreeNode right = null;

    public TreeNode(int val) {
        this.val = val;
    }
}
public class Solution{
    public ArrayList<Integer> PrintFromTopToBottom(TreeNode root){
        ArrayList<Integer> list=new ArrayList<Integer>();
        if(root==null)return list;
        Queue<TreeNode>queue=new LinkedList<TreeNode>();
        queue.offer(root);
        while(!queue.isEmpty()){
            TreeNode t= queue.poll();
            list.add(t.val);
            if(t.left!=null)queue.offer(t.left);
            if(t.right!=null)queue.offer(t.right);
        } 
        return list;
    }
}


