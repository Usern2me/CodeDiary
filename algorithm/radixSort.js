/**
 * 基数排序
 * 基数排序的主要思路是,将所有待比较数值(注意,必须是正整数)统一为同样的数位长度,
 * 数位较短的数前面补零. 然后, 从最低位开始,
 * 依次进行一次稳定排序.
 * 这样从最低位排序一直到最高位排序完成以后, 数列就变成一个有序序列.
 */
Array.prototype.radixSort = function() {
    let arr = this.slice(0)
    const max = Math.max(...arr)
    let digit = `${max}`.length
    let start = 1
    let buckets = []
    while(digit > 0) {
      start *= 10
      for(let i = 0; i < arr.length; i++) {
        const index = arr[i] % start
        !buckets[index] && (buckets[index] = [])
        buckets[index].push(arr[i])
      }
      arr = []
      for(let i = 0; i < buckets.length; i++) {
        buckets[i] && (arr = arr.concat(buckets[i]))
      }
      buckets = []
      digit --
    }
    return arr
  }
  const arr = [1, 10, 100, 1000, 98, 67, 3, 28, 67, 888, 777]
  console.log(arr.radixSort())
