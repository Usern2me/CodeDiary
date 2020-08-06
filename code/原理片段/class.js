class Cat {
  // 构造函数
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  // 挂在prototype上的方法
  Say() {
    return "我的名字是" + this.name;
  }
}

class Lion extends cat {
  constructor() {
    super.Say();
  }
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var Cat = /*#__PURE__*/ (function () {
  // 构造函数
  function Cat(name, age) {
    this.name = name;
    this.age = age;
  } // 挂在prototype上的方法

  var _proto = Cat.prototype;

  _proto.Say = function Say() {
    return "我的名字是" + this.name;
  };

  return Cat;
})();

var Lion = /*#__PURE__*/ (function (_cat) {
  _inheritsLoose(Lion, _cat);

  function Lion() {
    var _this;

    _cat.prototype.Say.call(_assertThisInitialized(_this));

    return _assertThisInitialized(_this);
  }

  return Lion;
})(cat);
