const fs = require("fs")
const path = require("path")

let filePath = path.resolve("D:/code/CodeDiary/code")

fileTraverse(filePath)

function fileTraverse(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(filename => {
        //获取当前文件的绝对路径
        let filedir = path.join(filePath, filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, (erorr, stats) => {
          if (erorr) {
            console.warn("获取文件stats失败")
          } else {
            if (stats.isFile()) {
              fs.appendFile(`${filePath}/aaa.txt`, `name--->${filename}\n`, writeerr => {
                if (writeerr) console.warn("writeFile err--->", writeerr)
              })
            }
            if (stats.isDirectory()) {
              fs.appendFile(`${filePath}/mess/aaa.txt`, `---------------\n`, writeerr => {
                if (writeerr) console.warn("writeFile err--->", writeerr)
              })
              fileTraverse(filedir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      })
    }
  })
}
