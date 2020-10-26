function apply(context, arr) {
  context.fn = this;
  let result = context.fn(arr);
  delete context.fn;
  return result;
}
function bind(context, ...args) {
  const that = this;
  return function (...newArgs) {
    return that.apply(context, args.concat(newArgs));
  };
}
