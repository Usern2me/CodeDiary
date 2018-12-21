1. [深入理解 React 高阶组件](https://www.jianshu.com/p/0aae7d4d9bc1)
   > 属性代理（Props Proxy）：高阶组件操控传递给 WrappedComponen 的 props  
   > 反向继承（Inheritance Inversion）：高阶组件继承（extends）WrappedComponent  
   > a.代码复用，逻辑抽象  
   > b.抽离底层准备（bootstrap）代码  
   > c.渲染劫持 State  
   > d.抽象和更改 Props 更改
2. [React 入门教程--阮一峰](http://www.ruanyifeng.com/blog/2015/03/react.html)
3. [让 react 用起来更得心应手——(React 基础简析)](https://juejin.im/post/5bcc104ce51d450e543edd70?utm_source=gold_browser_extension)
4. [React 从渲染原理到性能优化（一）--IMWeb](http://imweb.io/topic/5b8df7db7cd95ea863193582)
5. [mixins-considered-harmful--use hoC component](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)
   > 1、mixins 带来了隐式依赖  
   > 2、mixins 与 mixins 之间，mixins 与组件之间容易导致命名冲突  
   > 3、由于 mixins 是侵入式的，它改变了原组件，所以修改 mixins 等于修改原组件，随着需求的增长 mixins 将变得复杂，导致滚雪球的复杂性。
