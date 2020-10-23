function isPrimes(n) {
  const isPrim = new Array(n).fill(true);
  for (let i = 2; i * i < n; i++) {
    if (isPrim[i]) {
      for (let j = i * i; j < n; j += i) {
        isPrim[j] = false;
      }
    }
  }
  return isPrim.filter((v) => !v).length;
}

console.log("isPrime-->", isPrimes(100));
