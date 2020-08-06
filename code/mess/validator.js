/**
 * schema-typed 
 * 地址：https://github.com/rsuite/schema-typed
    返回结果：
    {
        username: { hasError: false },
        email: { hasError: false },
        age: { hasError: true, errorMessage: '年龄应该在 18 到 30 岁之间' }
    },
 */
function getCheck(data) {
  return (value, rules) => {
    for (let i = 0; i < rules.length; i++) {
      let { onValid, errorMsg } = rules[i]
      let checkResult = onValid(value, data)

      if (typeof checkResult == "boolean" && !checkResult) {
        return { hasError: true, errorMsg }
      } else if (typeof checkResult === "object") {
        return checkResult
      }
    }
  }
}
class Type {
  constructor(value) {
    this.value = value
    this.hasError = false
    this.errorMsg = "default msg"
    this.rules = []
    this.isRequired = false
  }
  check(value, data) {
    if (this.required) {
      return { hasError: true, errorMsg: this.requiredMsg }
    }
    const checkValue = getCheck(data)
    let rules = []
    let checkStatus = null
    this.rules.forEach(item => {
      rules.push(item)
    })
    checkStatus = checkValue(value, rules)
    if (!checkStatus != null) {
      return checkStatus
    }
    return { hasError: false }
  }
  pushCheck(onValid, errorMsg) {
    errorMsg = errorMsg || this.rules[0].errorMsg
    this.rules.push({
      onValid,
      errorMsg
    })
  }
  isRequired(errorMsg) {
    this.required = true
    this.requiredMsg = errorMsg
    return this
  }
}
class StringTypeModel extends Type {
  constructor(errorMsg = "enter a valid string") {
    super("string")
    super.pushCheck(v => typeof v === "string", errorMsg)
  }
}
class NumberTypeModel extends Type {
  constructor(errorMsg = "enter a valid number") {
    super("number")
    super.pushCheck(v => typeof v === "number", errorMsg)
  }
}

const StringType = err => {
  new StringTypeModel(err)
}
const NumberType = err => {
  new NumberTypeModel(err)
}
class SchemaModel {
  constructor(rules) {
    this.rules = rules || {}
    this.error = {}
  }
  check(data) {
    let checkResult = {}
    Object.keys(this.rules).map(key => {
      checkResult[key] = this.checkForField(key, data[key], data)
    })
    return checkResult
  }
  // (name,'kitty',data)
  checkForField(fieldName, fieldValue, data) {
    let fieldChecker = this.rules[fieldName] //StringType().isRequired("用户名不能为空")
    if (!fieldChecker) {
      return { hasError: false }
    }
    return fieldChecker.check(fieldValue, data)
  }
}

const model = SchemaModel({
  username: StringType().isRequired("用户名不能为空"),
  age: NumberType("年龄应该是一个数字").range(18, 30, "年龄应该在 18 到 30 岁之间")
})

const checkResult = model.check({
  username: "foobar",
  age: 40
})

console.log("result->", checkResult)
