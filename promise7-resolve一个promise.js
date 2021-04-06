// 一个promise直接resolve一个promise的情况
let Promise = require("./promise-source/promise4.js");
new Promise((resolve, reject) => {
  resolve(
    new Promise((resolve, reject) => {
      resolve(900);
    })
  );
}).then((data) => {
  console.log(data);
});
