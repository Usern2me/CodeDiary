/**
 * 简单实现监听者订阅者模式
 * 主要步骤：
 *  1、数据监听器Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
 *  2、指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
 *  3、Watcher，作为连接Observer和Compile的桥梁，
 *  能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
 *  4、mvvm入口函数，整合以上三者
 */

/**
 * Observe 观察者
 * */
function Observe(data) {
  this.data = data;
  this.walk(data);
}
Observe.prototype = {
  walk: function(data) {
    let me = this;
    Object.keys(data).forEach(key => {
      me.convert(key, data[key]);
    });
  },
  convert: function(key, val) {
    this.defineReactive(this.data, key, val);
  },
  // 用原生的definePropperty方法定义get和set函数
  defineReactive: function(data, key, val) {
    let dep = new Dep();
    let childObj = observe(val);

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function() {
        Dep.target && dep.depend();
        return val;
      },
      set: function(newVal) {
        if (val === newVal) {
          return;
        }
        val = newVal;
        //新的值是Object的话进行监听
        childObj = observe(newVal);
        //通知订阅者
        dep.notify();
      }
    });
  }
};

function observe(value, vm) {
  if (!value || typeof value !== "object") {
    return;
  }
  return new Observe(value);
}

/**
 * Dep数组
 * 负责收集订阅者，遍历并在数据变动的时候调用update方法
 * */
let uid = 0;
function Dep() {
  this.id = uid++;
  this.subs = [];
}
Dep.prototype = {
  addSubs: function(sub) {
    this.subs.push(sub);
  },
  depend: function() {
    Dep.target.addDep(this);
  },
  removeSub: function(sub) {
    let index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  },
  // 遍历通知订阅者，触发他们的更新函数
  notify: function() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
};
Dep.target = null;

/**
 * Watcher 观察数据的变动
 * 1、在自身实例化时往属性订阅器(dep)里面添加自己
 * 2、自身必须有一个update()方法
 * 3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调。
 */
function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  this.depIds = {};

  if (typeof exp === "function") {
    this.getter = exp;
  } else {
    this.getter = this.parseGetter(exp);
  }

  // 触发属性的get方法，在dep里添加自己
  this.value = this.get();
}

Watcher.prototype = {
  get: function() {
    // Dep.target全局记录watcher
    Dep.target = this;
    // 触发get 把自己添加到订阅器里面
    let value = this.vm[exp];
    // 把watcher传给dep之后移除
    Dep.target = null;
    return value;
  },
  update: function() {
    this.run();
  },
  run: function() {
    let value = this.get();
    let oldValue = this.value;
    if (value !== oldValue) {
      this.value = value;
      // 执行compile里的回调函数，更新视图
      this.cb.call(this.vm, value, oldValue);
    }
  },
  // 1.每次调用run()的时候会触发相应属性的getter
  // getter里面会触发dep.depend()，继而触发这里的addDep
  // 2. 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，仅仅是改变了其值而已
  // 则不需要将当前watcher添加到该属性的dep里
  // 3. 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
  // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
  // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
  // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中
  // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了
  // 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
  // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
  // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
  // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
  // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher
  addDep: function(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSubs(this);
      this.depIds[dep.id] = dep;
    }
  },
  parseGetter: function(exp) {
    if (/[^\w.$]/.test(exp)) return;
    let exps = exp.split(".");
    return function(obj) {
      for (let i = 0; i < exps.length; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    };
  }
};

/**
 * Compile是解析函数，把模板的变量替换成数据
 */
function Compile(el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode ? el : document.querySelector(el);
  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el);
    this.init();
    this.$el.appendChild(this.$fragment);
  }
}
Compile.prototype = {
  init: function() {
    this.compileElement(this.$fragment);
  },
  // 创建文档碎片，因为放在内存不会引起重绘，比创建结点有更好的性能
  node2Fragment: function(el) {
    let fragment = document.createDocumentFragment(),
      child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  },
  // 遍历节点进行扫描编译
  compileElement: function(el) {
    let childNodes = el.childNodes,
      me = this;
    Array.prototype.slice.call(childNodes).forEach(node => {
      let text = node.textContent;
      // 双括号表达式正则
      let reg = /\{\{(.*)\}\}/;
      // 按元素节点方式编译
      if (me.isElementNode(node)) {
        me.compile(node);
      } else if (me.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1);
      }
      // 递归遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  },
  compile: function(nodes) {
    let nodeAttrs = node.attributes,
      me = this;
    Array.prototype.slice.call(nodeAttrs).forEach(function(attr) {
      // 以v-命名
      let attrName = attr.name;
      if (me.isDirective(attrName)) {
        let exp = attr.value; // content
        let dir = attrName.subString(2); // text
        // 事件指令 如v-on
        if (me.isEventDirective(dir)) {
          compileUtil.eventHandler(node, me.$vm, exp, dir);
        } else {
          // 普通指令
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }
        nodes.removeAttribute(attrName);
      }
    });
  },
  compileText: function(node, exp) {
    compileUtil.text(node, this.$vm, exp);
  },
  isDirective: function(attr) {
    return attr.indexOf("v-") == 0;
  },
  isEventDirective: function(dir) {
    return dir.indexOf("on") === 0;
  },
  isElementNode: function(node) {
    return node.nodeType == 1;
  },
  isTextNode: function(node) {
    return node.nodeType == 3;
  }
};

// 指令处理util
let compileUtil = {
  text: function(node, vm, exp) {
    this.bind(node, vm, exp, "text");
  },
  html: function(node, vm, exp) {
    this.bind(node, vm, exp, "html");
  },
  model: function(node, vm, exp) {
    this.bind(node, vm, exp, "model");
    let me = this,
      val = this._getVMVal(vm, exp);
    node.addEventListener("input", function(e) {
      let newValue = e.target.value;
      if (val === newVal) return;
      me._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  },
  class: function(node, vm, exp) {
    this.bind(node, vm, exp, "class");
  },
  bind: function(node, vm, exp, dir) {
    let updaterFn = updater[dir + "Updater"];
    // 第一次初始化视图
    updaterFn && updaterFn(node, vm[exp]);
    // 实例化watcher,在对应的属性消息订阅器里面添加改watcher
    new Watcher(vm, exp, function(newValue, oldValue) {
      updaterFn && updaterFn(node, newValue, oldValue);
    });
  },
  //事件处理
  eventHandler: function(node, vm, exp, dir) {
    let eventType = dir.split(":")[1],
      fn = vm.$options.methods && vm.$options.methods[exp];
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  _getVMVal: function(vm, exp) {
    let val = vm;
    exp = exp.split(".");
    exp.forEach(v => {
      val = val[v];
    });
    return val;
  },
  _setVMVal: function(vm, exp, value) {
    let val = vm;
    exp = exp.split(".");
    exp.forEach((v, i) => {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[v];
      } else {
        val[v] = value;
      }
    });
  }
};
// 更新函数
let updater = {
  textUpdater: function(node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },
  htmlUpdater: function(node, value) {
    node.innerHTML = typeof value == "undefined" ? "" : value;
  },
  classUpdater: function(node, value, oldValue) {
    let className = node.className;
    className = className.replace(oldValue, "").replace(/\s$/, "");
    let space = className && String(value) ? " " : "";
    node.className = className + space + value;
  },
  modelUpdater: function(node, value, oldValue) {
    node.value = typeof value == "undefined" ? "" : value;
  }
};

/**
 * MVVM主函数
 */
function MVVM(options) {
  this.$options = options || {};
  let data = (this._data = this.$options.data),
    me = this;
  //实现vm.xxx->vm._data.xxx
  Object.keys(data).forEach(key => {
    me._proxy(key);
  });
  observe(data, this);
  this.$compile = new Compile(options.el || document.body, this);
}

MVVM.prototype = {
  $watch: function(key, cb, options) {
    new Watcher(this, key, cb);
  },
  // 添加一层代理，可以直接访问vm._data的值
  _proxy: function(key, setter, getter) {
    let me = this;
    setter =
      setter ||
      Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
          return me._data[key];
        },
        set: function proxySetter(newVal) {
          me._data[key] = newVal;
        }
      });
  }
};
