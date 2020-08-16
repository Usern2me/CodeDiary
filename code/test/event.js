/**
 * 方法：on,emit,once,removeListener
 */

class EventEmitter {
  constructor() {
    this.eventMap = new Map();
  }
  on(name, fn) {
    const ev = this.eventMap.get(name);
    if (!ev) {
      this.eventMap.set(name, fn);
    } else {
      this.eventMap.set(name, [...ev, fn]);
    }
  }
  emit(name, ...args) {
    const ev = this.eventMap.get(name);
    const context = this;
    if (Array.isArray(ev)) {
      ev.forEach((v) => {
        v.apply(context, args);
      });
    } else {
      ev.apply(context, args);
    }
  }
  once(name, fn) {
    const context = this;
    function only(...args) {
      fn.apply(context, args);
      context.removeListener(name, fn);
    }
    only.origin = fn;
    this.on(name, only);
  }
  removeListener(name, fn) {
    const ev = this.eventMap.get(name);
    if (ev && ev instanceof Function) {
      this.eventMap.delete(name);
    } else if (Array.isArray(ev)) {
      ev.filter((v) => {
        // 可能有多个监听器的情况下，只删除fn那个
        // 同时需要对once的进行特殊处理
        return v != fn && v.origin != fn;
      });
    }
  }
}

// use
const event = new EventEmitter();
event.on("click", () => {
  console.log("click me");
});
event.emit("click");
