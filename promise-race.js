// 有一个成功或失败则采用他的结果   超时处理
// 赛跑，采用执行最快的
// race 方法如果其中一个完成了，另外一个还在执行，只是不用他的结果
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
