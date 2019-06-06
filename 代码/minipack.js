/**
 * 模块捆绑器 把小块代码编译成更大复杂的代码
 * 类似于webpack的模块系统
 * 从入口文件开始生成依赖图
 */
const fs = require("fs")
const path = require("path")
const babylon = require("babylon")
const traverse = require("babel-traverse").default
const { transformFromAst } = require("babel-core")

let ID = 0

// 接受文件路径并提取文件之间的关系
function createAsset(filename) {
  const content = fs.readFileSync(filename, "utf-8")
  // 生成ast树
  const ast = babylon.parse(content, {
    sourceType: "module"
  })

  // 保存模块的依赖的相对路径
  const dependencies = []
  traverse(ast, {
    // es模块import是静态的 Import后面跟着的就可以看作这个模块的依赖
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value)
    }
  })
  // 为这个模块分配唯一的标识符
  const id = ID++
  const { code } = transformFromAst(ast, null, {
    presets: ["env"]
  })
  return {
    id,
    filename,
    dependencies,
    code
  }
}

// 通过入口文件遍历整个项目得到依赖图
function createGraph(entry) {
  const mainAsset = createAsset(entry)
  const queue = [mainAsset]

  for (const asset of queue) {
    asset.mapping = {}
    const dirname = path.dirname(asset.filename)
    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath)
      const child = createAsset(absolutePath)
      // 把相对路径对应上子模块的id
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }
  return queue
}

// 打包函数 把依赖图传进来编译成一个函数整体
// 使用commomJS 传入一个require,module,exports
// 通过require调用模块的时候需要相对路径，由第二个参数提供
function bundle(graph) {
  let modules = ""
  graph.forEach(mod => {
    module += `${mod.id}:[
            function (require,module,exports){
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)},
        ]`
  })
  // 创建一个接受模块id的require函数，输入id输出模块相对路径和模块id的映射
  // 最后使用commonJS，需要导出模块时，通过改变exports对象来暴露模块的值
  const result = `
    (function(modules){
        function require(id){
            const [fn,mapping]=modules[id];
            function localRequire(name){
                return require(mapping[name]);
            }
            const module={export:{}};
            fn(localRequire,module,module.exports);
            return module.exports;
        }
        require(0);
    })({${modules}})
    `
  return result
}

const graph = createGraph("./aaa/entry.js")
const result = bundle(graph)
console.log("result--->", result)
