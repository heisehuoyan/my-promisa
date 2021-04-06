//值的穿透 .then().then().then()
let Promise = require("./promise-source/promise4.js");
new Promise((resolve, reject) => {
  reject(200);
})
  .then(null)
  .then(
    (data) => {
      console.log(data, "s");
    },
    (err) => {
      console.log(err, "e");
    }
  );
