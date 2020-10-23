async function sleep(fn, time) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
}
async function log(num) {
  console.log(num);
}
async function run() {
  await log(1);
  await sleep(() => {
    console.log(2);
  }, 3000);
  await log(3);
}
run();
