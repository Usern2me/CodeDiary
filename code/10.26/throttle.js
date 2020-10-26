function throttle(fn, time) {
  let prev = Date.now();
  return function (...args) {
    const context = this;
    let now = Date.now();
    if (now - prev >= time) {
      fn.apply(context, args);
      prev = now;
    }
  };
}

function debounce(fn, time) {
  let timeout = null;
  return function (...args) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn.apply(context, args), time);
  };
}
