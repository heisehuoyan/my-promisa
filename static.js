let Promise = require("./promise-source/promise4.js");
// Promise.resolve
Promise.resolve(500).then((data) => {
  console.log(data);
});
// 等价于
new Promise((resolve) => {
  resolve(500);
}).then((data) => {
  console.log(data);
});

Promise.resolve(
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1500);
    }, 1000);
  })
).then((data) => {
  console.log(data);
});

// Promise.reject
Promise.reject(
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1500);
    }, 1000);
  })
).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err, "e");
  }
);

// catch 没有成功的失败
Promise.reject(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1500);
    }, 1000);
  })
).then(null, (err) => {
  console.log(err, "e");
});

Promise.reject(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1500);
    }, 1000);
  })
).catch((err) => {
  console.log(err, "e");
});
