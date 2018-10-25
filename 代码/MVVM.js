/**
 * 简单实现监听者订阅者模式
 * 主要步骤：
 *  1、实现一个数据监听器Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
 *  2、实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
 *  3、实现一个Watcher，作为连接Observer和Compile的桥梁，
 *  能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图 
 *  4、mvvm入口函数，整合以上三者
 */

/** 
 * Observe 观察者
 * */
function observe(data) {
    if (!data || typeof data !== 'object') {
        return
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key])
    })
}

// 用原生的definePropperty方法定义get和set函数
function defineReactive(data, key, val) {
    let dep = new Dep()
    observe(data)

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function () {
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set: function (newVal) {
            if (val === newVal) return null
            val = newVal
            dep.notify()
        }
    })
}

/** 
 * Dep数组
 * 负责收集订阅者，遍历并在数据变动的时候调用update方法
 * */
function Dep() {
    this.subs = []
}
Dep.prototype = {
    addSubs: function (sub) {
        this.subs.push(sub)
    },
    notify: function () {
        this.subs.forEach((sub) => {
            sub.update()
        })
    }
}

/**
 * Watcher 观察数据的变动
 * 1、在自身实例化时往属性订阅器(dep)里面添加自己 
 * 2、自身必须有一个update()方法 
 * 3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调。 
 */
function Watcher(vm, exp, cd) {
    this.cb = cb
    this.vm = vm
    this.exp = exp
    // 触发属性的get方法，在dep里添加自己
    this.value = this.get()
}

Watcher.prototype = {
    get: function () {
        // Dep.target全局记录watcher
        Dep.target = this
        // 触发get 把自己添加到订阅器里面
        let value = this.vm[exp]
        // 把watcher传给dep之后移除
        Dep.target = null
        return value
    },
    update: function () {
        this.run()
    },
    run: function () {
        let value = this.get()
        let oldValue = this.value
        if (value !== oldValue) {
            this.value = value
            // 执行compile里的回调函数，更新视图
            this.cb.call(this.vm, value, oldValue)
        }
    }
}

/**
 * Compile是解析函数，把模板的变量替换成数据
 */
function Compile(el) {
    this.$el = this.isElementNode ? el : document.querySelector(el)
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el)
        this.init()
        this.$el.appendChild(this.$fragment)
    }
}
Compile.prototype = {
    init: function () {
        this.compileElement(this.$fragment)
    },
    // 创建文档碎片，因为放在内存不会引起重绘，比创建结点有更好的性能
    node2Fragment: function (el) {
        let fragment = document.createDocumentFragment(),
            child
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    },
    // 遍历节点进行扫描编译
    compileElement: function (el) {
        let childNodes = el.childNodes,
            me = this
        Array.prototype.slice.call(childNodes).forEach((node) => {
            let text = node.textContent
            // 双括号表达式正则
            let reg = /\{\{(.*)\}\}/
            // 按元素节点方式编译
            if (me.isElementNode(node)) {
                me.compile(node)
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1)
            }
            // 递归遍历编译子节点
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node)
            }
        })
    },
    compile: function (nodes) {
        let nodeAttrs = node.attributes,
            me = this
        Array.prototype.slice.call(nodeAttrs).forEach(function (attr) {
            // 以v-命名
            let attrName = attr.name
            if (me.isDirective(attrName)) {
                let exp = attr.value // content
                let dir = attrName.subString(2) // text
                // 事件指令 如v-on
                if (me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, me.$vm, exp, dir)
                } else {
                    // 普通指令
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp)
                }
            }
        })
    }
}

// 指令处理util
let compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    bind: function (node, vm, exp, dir) {
        let updaterFn = updater[dir + 'Updater']
        // 第一次初始化视图
        updaterFn && updaterFn(node, vm[exp])
        // 实例化watcher,在对应的属性消息订阅器里面添加改watcher
        new Watcher(vm, exp, function (newValue, oldValue) {
            updaterFn && updaterFn(node, newValue, oldValue)
        })
    }
}
// 更新函数
let updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value
    }
}

/**
 * MVVM主函数
 */
function MVVM(options) {
    this.$options = options
    let data = this._data = this.$options.data,
        me = this
    Object.keys(data).forEach((key) => {
        me._proxy(key)
    })
    observe(data, this)
    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    // 添加一层代理，可以直接访问vm._data的值
    _proxy: function (key) {
        let me = this
        Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return me._data[key]
            },
            set: function proxySetter(newVal) {
                me._data[key] = newVal
            }
        })
    }
}
