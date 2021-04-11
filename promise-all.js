// 多个promise全部完成后获取结果（成功了会根据请求的顺序依次返回执行结果），但是其中一个失败了，那么这个promise就失败了
// （同步，同一时刻拿到），多个异步请求的结果
let Promise = require("./promise-source/promise4.js");
Promise.all([
  1,
  2,
  3,
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  }),
])
  // .then((data) => {
  //   console.log(data);
  // })
  .catch((err) => {
    console.log(err, "失败了");
  });
