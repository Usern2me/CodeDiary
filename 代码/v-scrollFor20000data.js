/**
 * 使用vue的自定义指令
 * 监听滚动事件
 * 为大量的下拉列表数据渲染做优化
 * 优化方法：
 * 1.监听滚动
 * 2.向下滚动时向后加载数据
 * 3.向上滚动是向前加载数据
 * 4.数据有入有出
 */
export default () => {
    //使用： v-scroll="handleScroll"
    Vue.directive('scroll', {
            //钩子函数
            bind(el, binding) {
                let scrollPosition = 0; //滚动位置
                //快到达临界点的时候变化数据
                const LIMIT_HEIGHT = this.scrollHeight / 4;
                //滚动位置距离底部的位置
                let scrollBottom = this.scrollHeight - (this.scrollTop + this.clientTop) < LIMIT_HEIGHT;

                let SCROLL_DOM = el.querySelector('.el-selector');

                SCROLL_DOM.addEventListener('scroll', () => {
                        //true为向下滚动
                        let flagToDirection = this.scrollTop - scrollPosition > 0;
                        scrollPosition = this.scrollTop;
                        //把滚动行为告诉组件
                        //向下滚动
                        if (flagToDirection && scrollBottom)
                            binding.value(flagToDirection, SCROLL_DOM, this.scrollHeight / 2)
                        //向上滚动
                        if (!flagToDirection && this.scrollTop < LIMIT_HEIGHT)
                            binding.value(flagToDirection, SCROLL_DOM, this.scrollHeight / 2)

                    }
                }
            })
    }

    //维持一个[1,2,3,4]的数组pageMap，保存加载的数据是一定的
    //pageIndex:2 当前所在的页
    //pageLimit:4 共欲加载页
    //pageSize:100 一页100条
    function handleScroll(param, el, middlePosition) {
        //向下滚动
        if (param) {
            if (this.pageMap.length >= this.pageLimit) {
                this.pageMap.shift();
                this.list.splice(0, this.pageSize)
                //滚回到中间位置
                el.scrollTop = middlePosition;
            }
            ++this.pageIndex;
            this.pageMap.push(this.pageIndex);
            //加载当前的数据
            this.list.push(...this.fetch(this.pageIndex))

        } else { //向上滚动
            //向上滚动时，如果没有达到第一页则继续加载
            if (this.pageMap[0] > 1) {
                this.pageIndex = this.pageMap[0] - 1;
                this.pageMap.pop();
                //把最后一页pop掉然后重置pageMap
                this.pageMap = [this.pageIndex, ...this.pageMap]
                //删除最后一页的数据
                this.list.splice(-this.pageSize, this.pageSize);
                //更新数据列表
                this.list = [...this.fetch(this.pageIndex), ...this.list]
                el.scrollTop = middlePosition;
            } else return false;
        }
    }
