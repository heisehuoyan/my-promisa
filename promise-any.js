// 如果其中一个成功就成功，并且会取第一个成功的值（最快的），所有失败才失败

Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    let re = [];
    let time = 0;
    const pro = function (val, index) {
      re[index] = val;
      if (++time === promises.length) {
        reject(re);
      }
    };

    for (let i = 0; i < promises.length; i++) {
      let p = promises[i];
      if (p && typeof p.then === "function") {
        p.then(
          (data) => {
            resolve(data);
          },
          (err) => {
            pro(err, i);
          }
        );
      } else {
        pro(p, i);
      }
    }
  });
};

const pErr = new Promise((resolve, reject) => {
  reject("总是失败");
});

Promise.any([pErr]).catch((err) => {
  console.log(err);
});

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("成功1");
  }, 200);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("成功2");
  }, 300);
});
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功3");
  }, 100);
});
Promise.any([p1, p2, p3]).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);
