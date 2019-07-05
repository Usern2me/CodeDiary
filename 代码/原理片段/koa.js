/**
 * from:https://juejin.im/post/5be3a0a65188256ccc192a87
 * koa源码结构：
 * 1. application.js -> 入口文件，向外创建class，继承Events，封装常用的api
 * 2. context.js -> 上下文ctx，封装一层代理
 * 3. request.js -> 原生https.request的操作
 * 4. response.js -> 原生https.response的操作
 * ----------------------------------------------------------------
 * 核心功能：
 * 1. 封装node，http，创建koa构造函数
 * 2. 构造request和response对象
 * 3. 中间件的机制和洋葱模型的实现
 * 4. 错误捕捉和错误处理
 */

const http = require("http")
class Application {
  constructor() {
    this.callbackFunc
  }
  // 封装http自带的监听函数
  listen(port) {
    let server = http.createServer(this.callbackFunc())
    server.listen(port)
  }
  use(fn) {
    this.callbackFunc = fn
  }
  callback() {
    return (req, res) => {
      let ctx = this.createContext(req, res)
      let response = () => this.responseBody(ctx)
      let onerror = err => this.onerror(err, ctx)
      let fn = this.compose()
      // 处理中间件抛出的错误
      return fn(ctx)
        .then(response)
        .catch(onerror)
    }
  }
  // 洋葱
  compose() {
    return async ctx => {
      // 把上一个中间件的next当作参数传给下一个中间件
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, next)
        }
      }
      let len = this.middlewares.length
      let next = async () => {
        return Promise.resolve()
      }
      for (let i = len - 1; i >= 0; i--) {
        let curMiddleware = this.middlewares[i]
        next = createNext(curMiddleware, next)
      }
      await next()
    }
  }
}
export default Application
