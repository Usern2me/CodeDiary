const compose = (...funs) => {
    funs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);
}
const a = (index) => index * 2;
const b = (index) => index * index;

compose(a,b)(1,1)
// 浏览器里可以运行？
