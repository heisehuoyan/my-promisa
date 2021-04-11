// 有一个成功或失败则采用他的结果   超时处理
// 赛跑，采用执行最快的
// race 方法如果其中一个完成了，另外一个还在执行，只是不用他的结果
let Promise = require("./promise-source/promise4.js");
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功");
  }, 1000);
});
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("失败");
  }, 500);
});

Promise.race([p1, p2])
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("catch", err);
  });

// 图片加载，请求加载，超时（不采用成功的结果） 初步
var abort;
let p3 = new Promise((resolve, reject) => {
  abort = reject;
  setTimeout(() => {
    resolve("成功");
  }, 3000);
});
p3.abort = abort;

p3.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);

setTimeout(() => {
  p3.abort("超过一秒了");
}, 1000);

/// race特点其中一个失败就失败 ，构造自己的promise，和p1放在一起 ------------------------------------------

let p4 = wrap(p3);

function wrap(p1) {
  let abort;
  let p = new Promise((reject) => {
    abort = reject;
  });
  let p2 = Promise.race([p, p1]);
  p2.abort = abort; // 如果用户调用abort，这个p就失败了=p2失败了
  return p2;
}

p4.then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  }
);

setTimeout(() => {
  p4.abort("超过一秒了");
}, 1000);

/// axios超时   xhr.abort() 控制请求中断
// xhr.onerror xhr.timeout

//fetch基于promise，promise没法中断请求  ，中断fetch中断方法有兼容性问题，相当于没有
