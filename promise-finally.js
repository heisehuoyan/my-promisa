//是原型的finally， 无论如何都会执行，可以继续向下执行
Promise.prototype.finally = function (cb) {
  return this.then(
    (data) => {
      // 如何能保证promise执行完成
      // cb()里面可能有promise，则需要等待cb()里的promise执行完成，使用Promise.resolve实现等待cb()里的promise执行完成
      // data使用最外层的resolve返回的值
      return Promise.resolve(cb()).then(() => data);
    },
    (err) => {
      //如果reject(2)时执行
      // cb()内存在promise时：resolve时不会采用成功的结果，而是直接抛出异常让catch方法捕获到，打印2；reject时，就走不到成功，直接走cb内promise的失败结果，则打印1000
      return Promise.resolve(cb()).then(() => {
        throw err;
      });
    }
  );
};

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve("成功");
    reject("2");
  }, 3000);
});

p.finally((data) => {
  // 无论什么状态都会执行
  // finally后还能then,说明finally(拿不到data)本身是个then
  console.log("finally", data);
  return new Promise((resolve, reject) => {
    // 不会使用promise的成功结果，但是会等待
    // resolve(1000);
    // setTimeout(() => {
    //   resolve(1000);
    // }, 1000);
    // 但是如果reject,会将失败结果传递
    setTimeout(() => {
      reject(1000);
    }, 1000);
  });
})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("catch", err);
  });
