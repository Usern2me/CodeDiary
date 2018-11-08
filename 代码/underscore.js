/**
 * UnderScore.js 1.8.3
 * 参考https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js
 * Object->Array->Collection->Function->Utility
 */
(function () {
    /**
     * 定义变量块
     */
    // 浏览器下是window,node里面是exports
    let root = this;
    // 原来全局环境的_缓存起来 防止冲突
    let previousUnderscore = root._;
    // 缓存变量 压缩代码 同时可以减少在原型链上的查找次数
    let ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
    let push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
    // ES5原生方法，如果支持，underscore里面会优先使用
    let nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;

    /**
     * 核心函数块
     */
    let Ctor = function () {};
    // oop调用时相当于一个构造函数，支持无new的构造函数
    let _ = function (obj) {
        if (obj instanceof _) return obj;
        // 不是_函数的实例返回一个实例化的对象
        if (!(this instanceof _)) return new _(obj);
        //将obj赋值给this._wrapped属性
        this._wrapped = obj;
    };

    //将上面定义的_赋给全局的_ 可以在全局里面使用_
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    //版本号
    _.VERSION = '1.8.3';

    //根据this指向返回不同的迭代函数
    let optimizeCb = function (func, context, argCount) {
        // 如果没有指定this的指向 
        if (context === void 0) {
            return func;
        }
        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            case 2:
                return function (value, other) {
                    return func.call(context, value, other);
                };
                // 有指定this但是没有传入argCount,_.each,_.map
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumnulator, value, index, collection) {
                    return func.call(context, accumnulator, value, index, collection);
                };
        }
        //不用上面的switch 直接执行这个就行了
        //原因是call比apply快很多
        //apply在运行之前会对参数的数组进行检验和深拷贝
        return function () {
            return func.apply(context, arguments);
        };
    };

    //判断参数类型的回调函数，下面用到了
    let cb = function (value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };

    //迭代器
    _.iteratee = function (value, context) {
        return cb(value, context, Infinity);
    };

    //assigner functions
    // 有三个方法用到了这个内部函数
    // _.extend & _.extendOwn & _.defaults
    // _.extend = createAssigner(_.allKeys);
    // _.extendOwn = _.assign = createAssigner(_.keys);
    // _.defaults = createAssigner(_.allKeys, true);
    let createAssigner = function (keysFunc, undefinedOnly) {
        return function (obj) {
            let length = arguments.length;
            if (length < 2 || obj == null) return obj;

            //遍历除了第一个参数以外的对象参数
            for (let index = 1; index < length; index++) {
                let source = arguments[index],
                    //提取对象参数的keys值
                    keys = keysFunc(source),
                    l = keys.length;
                //遍历该对象的键值对
                for (let i = 0; i < l; i++) {
                    let key = keys[i];
                    // _.extend和_.extendOwn方法 没传undefinedOnly
                    //后面对象的键值对直接覆盖obj
                    //_.defaults undefined为true
                    if (!undefinedOnly || obj[key] === void 0) {
                        obj[key] = source[key];
                    }
                }
                //返回已继承后面对象参数属性的第一个参数对象
                return obj;
            };
        };
    };

    //create方法
    let baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);

        Ctor.prototype = prototype;
        let result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    //闭包 下面用到property('length')
    let property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        }
    }

    /**
     * 集合用的方法
     * Array或者Object
     * 共25个扩展方法
     */
    let MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    // 返回参数的长度值
    let getLength = property('length');

    //判断是否是arrayLike
    let isArrayLike = function (collection) {
        let length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    //_.each _.forEach
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);

        let i, length;
        if (isArrayLike(obj)) {
            //数组直接遍历值
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj); // value,key,obj
            }
        } else {
            //obj是对象的话,遍历key
            let keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj) // value,key,obj
            }
        }
        //返回obj参数，供链式调用
        return obj;
    }

    //_.map _.collect
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        let keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (let i = 0; i < length; i++) {
            let currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    //_.reduce
    function createReduce(dir) {
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                let currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            //每次迭代返回值，供下次迭代作为参数使用
            return memo;
        }
        //iteratee迭代方法 memo初始值
        //context为迭代函数中this的指向
        return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            let keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                //dir>0 从左往右
                index = dir > 0 ? 0 : length - 1;
            if (arguments.length < 3) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            return iterator(obj, iteratee, memo, keys, index, length);
        };
    }
    _.reduce = _.foldl = _.inject = createReduce(1);
    _.reduceRight = _.foldr = createReduce(-1);

    //_.find
    _.find = _.detect = function (obj, predicate, context) {
        let key;
        if (isArrayLike(obj)) {
            key = _.findIndex(obj, predicate, context);
        } else {
            key = _.findKey(obj, predicate, context);
        }
        if (key !== void 0 && key !== -1) return obj[key];
    }

    //_.filter
    _.filter = _.select = function (obj, predicate, context) {
        let results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };

    //_.reject 结果是filter的补集
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };

    //_.every 判断每个元素是否都符合 返回true
    _.every = _.all = function (obj, predicate, context) {
        //根据this指向，返回相应的predicate函数
        predicate = cb(predicate, context);
        let keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (let i = 0; i < length; i++) {
            let currentKey = keys ? keys[i] : i;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    //_.some 有一个返回true就返回true
    _.some = _.any = function (obj, predicate, context) {
        //根据this指向，返回相应的predicate函数
        predicate = cb(predicate, context);
        let keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (let i = 0; i < length; i++) {
            let currentKey = keys ? keys[i] : i;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    }

    //_.contains
    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        //如果是对象返回value组成的数组
        if (!isArrayLike(obj)) obj = _.values(obj);
        //guard表示从第几个开始查询
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    }

    //_.invoke 对每个元素调用method方法
    //method后面的参数会被当成是参数传入method里面
    _.invoke = function (obj, method) {
        let args = slice.call(this.arguments, 2);
        let isFunc = _.isFunction(method);

        return _.map(obj, value => {
            //不是函数的话可能是obj的key的值
            let func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        });
    };
})
