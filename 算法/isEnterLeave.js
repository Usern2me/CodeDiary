/**
 * 输入三个字符串s1、s2和s3，判断第三个字符串s3是否由前两个字符串s1和s2交错而成
 * 即不改变s1和s2中各个字符原有的相对顺序
 * 例如当s1 = “aabcc”，s2 = “dbbca”，s3 = “aadbbcbcac”时
 * 则输出true，但如果s3=“accabdbbca”，则输出false。
 */
/**
 * 令dp[i][j]代表s3[0...i+j-1]是否由s1[0...i-1]和s2[0...j-1]的字符组成
 * 
 * 1.如果s1当前字符（即s1[i-1]）等于s3当前字符（即s3[i+j-1]）
 * 而且dp[i-1][j]为真，那么可以取s1当前字符而忽略s2的情况，dp[i][j]返回真；
 * 2.如果s2当前字符等于s3当前字符，并且dp[i][j-1]为真，
 * 那么可以取s2而忽略s1的情况，dp[i][j]返回真，其它情况，dp[i][j]返回假
 */
function isEnterLeave(s1, s2, s3) {
    let n = s1.length,
        m = s2.length,
        s = s3.length;
    if (n + m !== s) return false;
    let dp = [0][0]
    for (let i = 0; i < n + 1; i++) {
        for (let j = 0; j < m + 1; j++) {
            if (dp[i][j] || (i - 1 >= 0 && dp[i - 1][j] == true &&
                    s1.charAt(i - 1) == s3.charAt(i + j - 1)) ||
                (j - 1 >= 0 && dp[i][j - 1] == true &&
                    s2.charAt(j - 1) == s3.charAt(i + j - 1))) {
                dp[i][j] = true;
            } else {
                dp[i][j] = false;
            }
        }
        return dp[n][m];
    }
}
