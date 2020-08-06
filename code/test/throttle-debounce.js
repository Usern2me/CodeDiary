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
