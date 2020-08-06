class EventEmeitter {
  constructor() {
    this._events = this._events || new Map();
    this._maxListeners = this._maxListeners || 10;
  }
  // 触发函数 使用call/apply
  emit(type, ...args) {
    let handler;
    handler = this._events.get(type);
    if (Array.isArray(handler)) {
      for (let i of handler) {
        if (args.length > 0) {
          i.apply(this, args);
        } else {
          i.call(this);
        }
      }
    } else {
      // 长度大于3使用apply性能更好
      if (args.length > 0) {
        handler.apply(this, args);
      } else {
        handler.call(this);
      }
    }
    return true;
  }
  // 添加监听器
  addListener(type, fn) {
    const handler = this._events.get(type); // 对应事件的函数清单
    if (!handler) {
      this._events.set(type, fn);
    } else if (handler && typeof handler === "function") {
      //只有一个监听者
      this._events.set(type, [handler, fn]); //把之前的和刚加进来的合并成一个数组
    } else {
      handler.push(fn);
    }
    if (!this._events.get(type)) {
      this._events.set(type, fn);
    }
  }
  // 移除监听器
  removeListener(type, fn) {
    const handler = this._events.get(type);
    if (handler && typeof handler === "function") {
      this._events.delete(type, fn);
    } else {
      let pos;
      for (let i in handler) {
        if (handler[i] === fn) {
          pos = i;
        } else {
          pos = -1;
        }
      }
      if (pos != -1) {
        handler.splice(pos, 1);
        if (handler.length === 1) {
          this._events.set(type, handler[0]);
        }
      } else {
        return this;
      }
    }
  }
}
class Observer {
  constructor(id, subject) {
    this.id = id;
    this.subject = subject;
  }
  on(label, callback) {
    this.subject.addListener(label, callback);
  }
}
