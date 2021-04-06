// 帮我们减少一次调用：针对目前来说，应用不是很广泛
// let Promise = require("./promise-source/promise4.js");
const fs = require("fs");
// 正常实现
function readFile1(url, encode) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, encode, function (err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
}

// 使用deferred

function readFile2(url, encode) {
  //dfd有promise对象
  let dfd = Promise.deferred();
  fs.readFile(url, encode, function (err, data) {
    if (err) dfd.reject(err);
    dfd.resolve(data);
  });
  return dfd.promise;
}
readFile1("./b.txt", "utf8").then((data) => {
  console.log(data);
});
readFile2("./b.txt", "utf8").then((data) => {
  console.log(data);
});
// 面试一般会考：实现一个延迟对象
