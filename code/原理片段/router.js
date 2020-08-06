class BaseRouter {
  constructor(router) {
    this.router = router;
    this.current = {
      path: "/",
      query: {},
      params: {},
      name: "",
      fullPath: "/",
      route: {},
    };
  }
  transitionTo(target, cb) {
    // 通过对比传入的 routes 获取匹配到的 targetRoute 对象
    const targetRoute = match(target, this.router.routes);
    this.confirmTransition(targetRoute, () => {
      this.current.route = targetRoute;
      this.current.name = targetRoute.name;
      this.current.path = targetRoute.path;
      this.current.query = targetRoute.query;
      cb && cb();
    });
  }

  confirmTransition(route, cb) {
    // 钩子函数执行队列
    let queue = [].concat(
      this.router.beforeEach,
      this.current.route.beforeLeave,
      route.beforeEnter,
      route.afterEnter
    );

    // 通过 step 调度执行
    let i = -1;
    const step = () => {
      i++;
      if (i > queue.length) {
        cb();
      } else if (queue[i]) {
        queue[i](step);
      } else {
        step();
      }
    };
    step(i);
  }

  match(path, routeMap) {
    let match = {};
    if (typeof path === "string" || path.name === undefined) {
      for (let route of routeMap) {
        if (route.path === path || route.path === path.path) {
          match = route;
          break;
        }
      }
    } else {
      for (let route of routeMap) {
        if (route.name === path.name) {
          match = route;
          if (path.query) {
            match.query = path.query;
          }
          break;
        }
      }
    }
    return match;
  }

  getCurrentLocation() {
    const href = window.location.href;
    const index = href.indexOf("#");
    // 处理带#的路径
    return index === -1 ? "" : href.slice(index + 1);
  }
}

class HashHistory extends BaseRouter {
  constructor(router) {
    super(router);
    window.addEventListener("hashchange", () => {
      this.transitionTo(this.getCurrentLocation());
    });
  }
  push(location) {
    const targetRoute = match(location, this.router.routes);

    this.transitionTo(targetRoute, () => {
      changeUrl(this.current.fullPath.substring(1));
    });
  }
}

class HTML5History extends BaseRouter {
  constructor(router) {
    super(router);
    window.addEventListener("popstate", () => {
      this.transitionTo(getLocation());
    });
  }
  push(location) {
    const targetRoute = match(location, this.router.routes);

    this.transitionTo(targetRoute, () => {
      changeUrl(this.router.base, this.current.fullPath);
    });
  }
}
