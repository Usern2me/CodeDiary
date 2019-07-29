// 通过使用hash+hashChange实现
class Routers {
    constructor() {
        this.routes = {};
        this.currentUrl = '';
        this.refresh = this.refresh.bind(this);
        // 监听load和haschange事件，探测url改变
        window.addEventListener('load', this.refresh, false);
        window.addEventListener('hashchange', this.refresh, false);
    }
    route(path, callback) {
        this.routes[path] = callback || function () { };
    }
    refresh() {
        this.currentUrl = location.hash.slice(1) || '/';
        this.routes[this.currentUrl]();
        console.log(this.routes);
    }
}
