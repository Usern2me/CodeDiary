/**
 * 学习一下原生的操作dom的方式
 * 来源：https://github.com/nefe/You-Dont-Need-jQuery
 */

/**
 * 🎈query selector
 **/

// 返回NodeList集合，性能不好
document.querySelector("#aaa") // 返回第一个选择的元素
document.querySelectorAll("#aaa") // 返回所有选择的元素

// 返回HTMLCollection集合，性能比上面那家伙好
document.getElementById('id')
document.getElementsByClassName('classname')
document.getElementsByTagName('tagname')

// 兄弟元素
[...el.parentNode.children].filter(child=>{child!=el})
// 上个元素
el.previousElementSibling;
// 下个元素
el.nextElementSibling;
// 获得匹配选择器的第一个祖先元素,从dom树往上
el.closest();

// 获取表单值
document.querySelector('#input-value').value
// 获取e.currentTarget在radio中的索引
Array.prototype.indexOf.call(document.querySelectorAll('.aaa'),e.currentTarget)

// iframe的html
iframe.contentDocument;

// 获取元素属性
el.getAttribute('aaa')
// 设置元素属性
el.setAttribute('aaa', 'color')
// 获取data属性
el.getAttribute('data-a') || el.dataset('a')

/**
 * 🎈CSS & STYLE
 */

// 获取style
const win = el.ownerDocument.defaultView //获取auto下的默认值
win.getComputedStyle(el, null).color
// 设置style
el.style.color='#fff'

// add class
el.classList.add('className')
// remove class
el.classList.remove('classname')
// has class 
el.classList.contains('classname')
// toggle class
el.classList.toggle('classname')

// 获取window含scrollbar的高度
window.document.documentElement.clientHeight;
// 获取window不含scrollbar的高度
window.innerHeight;
// 获取document height
const body = document.body;
const html = document.documentElement;
const height = Math.max(
    body.offsetHeight,
    body.scrollHeight,
    html.clientHeight,
    html.offsetHeight,
    html.scrollHeight
)
// 获取元素高度
el.clientHeight || el.getBoundingClientRect().height;

// 元素相对父元素的位移
const offset = { left: el.offsetLeft, top: el.offsetTop }
// 元素相对文档的位移
const box = el.getBoundingClientRect();
const offsetClient = {
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
}
// 滚动条位置
(document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

/**
 * 🎈 DOM操作
 */
// 移除dom里的元素
el.parentNode.removeChild(children)
// 获取和设置文本内容
el.textContent;
// 获取和设置html
el.innerHTML;
// append到元素的末尾
el.insertAdjacentHTML('beforeend','<div>ddd</div>')
el.appendChild(newEl);
// 在本身内部插入新节点
el.insertAdjacentHTML('afterbegin','<div>sss</div>')
el.insertBefore(newEl, el.firstChild);
// 在选中元素前面插入新节点
el.insertAdjacentHTML('beforebegin', '<div></div>')
el.parentNode.insertBefore(newEl, el)
// 在选中元素后面插入新的节点
el.insertAdjacentHTML('afterend', '<div></div>')
el.parentNode.insertBefore(newEl,el.nextSibling)

// 匹配给定的选择器
el.matches(selector)
// 拷贝元素 深度拷贝加true
el.cloneNode()

// 移除所有节点
el.innerHTML = ''

/**
 * Events
 */
// dom完全加载完成触发DOMContentLoaded,所有资源完成触发load事件
document.addEventListener('DOMContentLoaded', () => { })
// 绑定事件
el.addEventListener('onclick', () => { })
// 解绑事件
el.removeEventListener('onclick', () => { })
// 触发自定义事件
if (window.CustomEvent) {
    const event = new CustomEvent('cv', { detail: { key: 1 } })
} else {
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent('ce',true,true,{key:1})
}
el.dispatchEvent(event);
