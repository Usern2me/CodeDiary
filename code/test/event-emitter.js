/**
 * EventEmitter:
 * 1. on("eventName",fn)
 * 2. emit("eventName",data)
 * 3. once("eventName",fn)
 * 4. removeListener("eventName",fn)
 */

class EventEmitter {
  constructor() {
    this._events = this._events || new Map();
  }

  on(name, fn) {
    const handler = this._events.get(name);
    if (!handler) {
      this._events.set(name, fn);
    } else if (handler && handler instanceof Function) {
      this._events.set(name, [handler, fn]);
    } else {
      handler.push(fn);
    }
  }

  emit(name, ...args) {
    const handler = this._events.get(name);
    if (Array.isArray(handler)) {
      handler.map((fn) => {
        fn.call(this, ...args);
      });
    } else if (handler instanceof Function) {
      handler.call(this, ...args);
    }
  }

  once(name, fn) {
    const _this = this;
    // 中间函数，执行一次之后删除
    function only(...args) {
      fn.call(this, ...args);
      _this.removeListener(name, only);
    }
    // 保存原来的函数，用于remove的判断
    only.origin = fn;
    this.on(name, only);
  }

  removeListener(name, fn) {
    const handler = this._events.get(name);

    if (handler && handler instanceof Function) {
      this._events.delete(name);
    } else if (Array.isArray(handler)) {
      handler.filter((v) => {
        return v !== fn && v.origin !== fn;
      });
    }
  }
}

const event = new EventEmitter();

const listenerFn = (data) => {
  console.log("listener get---->", data);
};

event.on("success", listenerFn);

event.emit("success", 1);

event.emit("success", 2);

event.removeListener("success", listenerFn);

event.emit("success", 3);
