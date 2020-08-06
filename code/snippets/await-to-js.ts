/**
 * 不用try-catch的await包装函数
 * 地址：https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
 * 使用方法：
 * [err,user]=await to(UserModel.findById(1))
 * @param {Promise} promise
 * @param {Object=} errorExt
 * @return {Promise}
 */

export function to<T, U = any>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>(err => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}

export default to;

