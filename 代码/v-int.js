/**
 * 自定义指令 使用就在上面加v-int就可以把输入的值转换成整数
 */
import Vue from 'vue'
export default () => {
  // 针对 el-input做的限制，只能输入正整数
  Vue.directive('Int', {
    bind: function (el) {
      const input = el.getElementsByTagName('input')[0]
      input.onkeyup = function (e) {
        if (input.value.length === 1) {
          input.value = input.value.replace(/[^1-9]/g, '')
        } else {
          input.value = input.value.replace(/[^\d]/g, '')
        }
        trigger(input, 'input')
      }
      input.onblur = function (e) {
        if (input.value.length === 1) {
          input.value = input.value.replace(/[^1-9]/g, '')
        } else {
          input.value = input.value.replace(/[^\d]/g, '')
        }
        trigger(input, 'input')
      }
    }

  })
}
/*********************************
  ** Fn: trigger
  ** Intro: 参考 https://github.com/vuejs/Discussion/issues/157#issuecomment-273301588
  ** Author: zyx
*********************************/
const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

