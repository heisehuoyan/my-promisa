// 主要是将异步方法转化成promise形式,主要是给node使用
// 回调的参数，第一个永远是error

const fs = require("fs");
const utils = require("util");
let readFile = utils.promisify(fs.readFile);
fs.readFile("./b.txt", "utf8", function (err, data) {
  console.log(data);
});

readFile("./b.txt", "utf8").then((data) => {
  console.log(data);
});

// 实现promisify---------------------------------------------------

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // 最终执行的是传入的函数
      fn(...args, function (err, data) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
}

let readFile1 = promisify(fs.readFile);
readFile1("./b.txt", "utf8").then((data) => {
  console.log(data, "自己的promisify");
});

// 实现promisify 优化-------------------------------------------------
function promisifyAll(obj) {
  let o = {};
  for (const key in obj) {
    if (typeof obj[key] === "function") {
      o[key + "Promise"] = promisify(obj[key]);
    }
  }
  return o;
}
let fsPromise = promisifyAll(fs); // 只传模块

fsPromise.readFilePromise("./b.txt", "utf8").then((data) => {
  console.log(data, "自己的promisify2");
});
