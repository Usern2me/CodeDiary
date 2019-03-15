class _LazyMan {
  constructor(name) {
    this.tasks = []
    const task = () => {
      console.log(`hi,this is ${name}`)
      this.next()
    }
    this.tasks.push(task)
    // 每次执行一个task放在不同的事件队列，避免后执行setTimeOut的情况
    setTimeout(() => {
      this.next()
    }, 0)
  }
  next() {
    // 取第一个任务执行
    const task = this.tasks.shift()
    task && task()
  }
  sleep(time) {
    this.sleepHandle(time, false)
    return this
  }
  sleepFirst(time) {
    this.sleepHandle(time, true)
    return this
  }
  sleepHandle(time, type) {
    const task = () => {
      setTimeout(() => {
        console.log(`wake up after ${time}`)
        this.next()
      }, time * 1000)
    }
    if (type) {
      //sleep first
      this.tasks.unshift(task)
    } else {
      this.tasks.shift(task)
    }
  }
  eat(food) {
    const task = () => {
      console.log(`eat ${food}`)
      this.next()
    }
    this.tasks.push(task)
    return this
  }
}
function LazyMan(name) {
  return new _LazyMan(name)
}
LazyMan("man")
  .eat("dinner")
  .sleep(1)
  .eat("aaa")
