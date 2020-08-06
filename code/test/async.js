function spawn(genF) {
  return new Promise((reslove, reject) => {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (err) {
        return reject(err);
      }
      if (next.done) {
        return reslove(next.value);
      }
      Promise.resolve(next.value).then(
        (v) => {
          step(() => {
            return gen.next(v);
          });
        },
        (err) => {
          step(() => {
            return gen.throw(err);
          });
        }
      );
    }
    step(() => {
      return gen.next(undefined);
    });
  });
}
