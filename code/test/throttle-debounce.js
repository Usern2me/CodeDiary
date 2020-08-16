function throttle(fn, time) {
  let prev = Date.now();

  return function (...args) {
    const context = this;
    let now = Date.now();
    if (now - prev >= time) {
      fn.apply(context, args);
      prev = Date.now();
    }
  };
}

function throl(fn, time) {
  let prev = Date.now();
  return function (...args) {
    let now = Date.now();
    let self = this;
    if (now - prev >= time) {
      fn.apply(self, args);
      prev = Date.now();
    }
  };
}

// use:
const handle = () => {
  console.log("scroll");
};
setInterval(throttle(handle, 1000), 200);

function debounce(fn, time) {
  let timeout = null;
  return function () {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, time);
  };
}

function deboun(fn, time) {
  let timeout = null;
  return function (...args) {
    const self = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn.apply(self, args), time);
  };
}
