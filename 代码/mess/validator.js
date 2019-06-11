/**
 * 校验器 使用的是策略模式 
 * 使用方法：
 * let myForm=document.getElementById('#myForm')
 * validator.validator(myForm,rules)->返回true或者错误信息的数组
 * 支持验证一个表单 字段要对应
 * rules->{
 *      name:{
 *          require:true,
 *          rule:name,
 *          msg:'please enter a name'
 *          },
 *      email:{
 *          require:true,
 *          rule:email,
 *          msg:'please enter a email'
 *          },
 *      others:{
 *          require:false,
 *          regex:/^[123]+\d$/,
 *          msg:'others your error msg'
 *  }
 * }
 */

//校验规则
let validator = {
    required: {
        regex: /[^(^\s*)|(\s*$)]/,
        msg: '请输入至少一个字符'
    },
    email: {
        regex: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        msg: '请输入正确的邮箱格式'
    },
    mobile: {
        regx: /^[1][3,4,5,6,7,8]\d{9}$/,
        msg: '请输入正确的手机号码'
    },
    max: {
        msg: '字符超过最大长度'
    },
    min: {
        msg: '字符小于最小长度'
    }
}
class Validator {
    constructor(rules) {
        this.rules = rules || {};
    }
}
