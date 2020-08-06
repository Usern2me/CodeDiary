import java.util.ArrayList;
import java.util.Stack;

public class Solution {
    public boolean IsPopOrder(int [] pushA,int [] popA) {
      if(pushA.length==0||popA.length==0)return false;
        Stack<Integer> s=new Stack<Integer>();
        for(int i=0,j=0;i<pushA.length;i++){
            s.push(pushA[i]);
            while(j<popA.length&&popA[j]==s.peek()){
                s.pop();
                j++;
            }
        }
        return s.empty();
    }
}