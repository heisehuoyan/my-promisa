//[p1,p2]会拿到promise的所有结果， 不管成功还是失败都会获得结果，不会走catch

Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    let times = 0;
    let result = [];
    const promisefn = (p, val, index) => {
      result[index] = { status: p.status, value: val };
      if (++times === promises.length) {
        resolve(result);
      }
    };
    for (let i = 0; i < promises.length; i++) {
      let p = promises[i];
      if (p && typeof p.then === "function") {
        p.then(
          (data) => {
            setTimeout(() => {
              promisefn(p, data, i);
            }, 0);
          },
          (err) => {
            setTimeout(() => {
              promisefn(p, err, i);
            }, 0);
          }
        );
      } else {
        promisefn(p, p, i);
      }
    }
  });
};

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1000);
  }, 1000);
});

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2000);
  }, 2000);
});

Promise.allSettled([p1, p2, 9]).then((data) => {
  console.log(data);
});
