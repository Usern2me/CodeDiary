/**
 * 一次性使用tinyPNG的API生成压缩图片
 * 来源 -> https://juejin.im/post/5bd350a76fb9a05d2d02697c
 */
const path = require('path')
const fs = require('fs')
const tinify = require('tinify')
const chalk = require('chalk')
const defalutConf = require('./config/default')
const {
    promisify
} = require('util')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)

class ImgMin {
    constructor(conf) {
        this.conf = Object.assign({}, defalutConf, conf)
        this.imgs = 0
    }

    async isDir(filePath) {
        try {
            const stats = await stat(filePath)
            if (stats.isDirectory()) return true
            return false
        } catch (err) {
            return false
        }
    }

    async findImg(filePath) {
        try {
            const isDirectory = await this.isDir(filePath)
            if (!isDirectory) return;
            const files = await readdir(filePath)
            for (let file of files) {
                const fullPath = path.join(filePath, file)
                this.getImg(fullPath)
            }
        } catch (err) {
            console.log('err' + err)
        }
    }
    async getImg(file) {
        const stats = await stat(file)
        if (stats.isDirectory()) {
            this.findImg()
        } else if (stats.isFile()) {
            if (/\.(jpg|jpeg|png)$/.test(file)) {
                this.imgs++
                const left = leftCount()
                if (this.imgs > left || left < 0) {
                    console.log(chalk.red('当前剩余可压缩图片数不足'))
                    return;
                }
                await imgMin(file)
            } else {
                console.log(chalk.red('不支持的文件格式'))
            }
        }
    }
    async start() {
        try {
            const isValidated = await validate(this.conf.key)
            if (!isValidated) return;
            const filePath = this.conf.imgMinPath
            await this.findImg(filePath)
        } catch (err) {
            console.log(err)
        }
    }
    setKey(key) {
        tinify.key = key
    }
    async validate(key) {
        console.log(chalk.green('认证Key中...'))
        this.setKey(key)
        return new Promise(resolve => {
            tinify.validate((err) => {
                if (err) {
                    console.log(err)
                    return resolve(false)
                }
                console.log(chalk.green('认证成功'))
                const left = leftCount()
                if (left <= 0) {
                    console.log(chalk.red('当前key的剩余可用数已用尽'));
                    return resolve(false);
                }
                console.log(`当前可用的key还有${left}`)
                resolve(true)
            })
        })
    }
    compressionCount() {
        return tinify.compressionCount
    }
    leftCount() {
        const total = 500
        return total - Number(this.compressionCount())
    }
    writeFilePromise(file, content, cb) {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, content, (err) => {
                if (err) return reject(err)
                cb && cb()
                resolve()
            })

        })
    }
    toBufferPromise(sourceData) {
        return new Promise((resolve, reject) => {
            tinify.fromBuffer(sourceData).toBuffer((err, resultData) => {
                if (err) return reject(err)
                resolve(resultData)
            })
        })
    }
    async imgMin(img) {
        try {
            console.log(chalk.blue('开始压缩图片' + img))
            const sourceData = await readFile(img)
            const resultData = await this.toBufferPromise(sourceData)
            await this.writeFilePromise(img, resultData, () => {
                console.log(chalk.green(`图片压缩成功->${img}`))
            })
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * commander
 * 使用命令行方法：
 * gp p -k [key]
 */
program
    .command('imgMin')
    .alias('p')
    .option('-k, --key [key]', `Tinypng's key, Required`)
    .option('-p, --path [path]', `Compress directory. By default, the /images in the current working directory are taken. 
    Please enter an absolute path such as /Users/admin/Documents/xx...`)
    .action(options => {
        let conf = {}
        if (!options) {
            console.log(chalk.red('enter key please'))
            return;
        }
        options.key && (conf.key = options.key)
        options.path && (conf.imgMinPath = options.path)
        const imgMin = new ImgMin(conf)
        imgMin.start()
    })
