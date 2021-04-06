// promise2 == x 死循环了 ----------------------------------------------------------
let promise2 = new Promise((resolve, reject) => {
  resolve(1);
}).then(() => {
  return promise2;
});
// x.then ------------------------------------------------------------
let p = {};
let index = 0;
Object.defineProperty(p, "then", {
  get() {
    if (++index == 2) throw new Error();
  },
});
