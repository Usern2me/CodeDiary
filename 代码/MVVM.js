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
 */
Watcher.prototype = {
    get: function (key) {
        // Dep.target全局记录watcher
        Dep.target = this
        // 这里会触发get函数，添加订阅者
        this.value = data[key]
        // 把watcher传给dep之后移除
        Dep.target = null
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
    // 创建文档片段，因为放在内存不会引起重绘，比创建结点有更好的性能
    node2Fragment: function (el) {
        let fragment = document.createDocumentFragment(),
            child
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    },
    compileElement: function (el) {
        let childNodes = el.childNodes,
            me = this
        Array.prototype.slice.call(childNodes).forEach((node) => {
            let text = node.textContent
            let reg = /\{\{(.*)\}\}/
            if (me.isElementNode(node)) {
                me.compile(node)
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1)
            }
            // 遍历编译子节点
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node)
            }
        })
    }
}
