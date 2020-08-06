public class Solution {
    public int NumberOf1(int n) {
       if(n==0)return 0;
        if(n==1)return 1;
        int res=0;
        while(n!=0){
            ++res;
            n=(n-1)&n;
            // 有几个1就循环几次。我们把原来的整数和减去1之后的结果做与运算，
            //从原来整数最右边一个1那一位开始所有位都会变成0。如1100&1011=1000.
        }
        return res;
    }
}
