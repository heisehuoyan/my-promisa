// promise a+ 规范

// Promise是个类，无需考虑兼容性问题
// 当使用Promise的时候会传入一个执行器，立即执行的
// 当前executor给个两个函数作为参数用来描述promise的状态。promise中有三个状态：成功态，等待态，拒绝态
// 默认是等待
// 每个promise实例都有一个then方法
// Promise一旦状态变化后不能更改
// Promise还是基于回调的
// es6-promise 包
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTRD = "REJECTRD";

//利用x的值决定是调用promise2的resolve还是reject，如果是promise则取他的状态，如果是普通值则调用resolve
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 == x) {
    return reject(new TypeError("错误"));
  }
  // 自己写的promise和别人的promise兼容
  // 如果x是对象或者函数的时候才有可能是promise

  // 别人的promise可能是调用成功后还能调用失败（别人写得可能有问题），加锁，只能是一旦成功或者失败都不能更改状态

  if ((typeof x == "object" && x !== null) || typeof x === "function") {
    // 确保了别人的promise符合规范
    let called = false;
    try {
      //有可能then方法是通过defineProperty来实现的 取值时可能会发生异常
      // promise 有then方法，也有可能是对象里面写了then方法
      let then = x.then;
      if (typeof then === "function") {
        //直接认为是promise，没法细化了 ，终点
        //promise.call.then(y=>{},r=>{})
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject); // 直到解析他不是promise位置
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        ); // 等价与 x.then() 但是不能x.then()这样写，因为这样会触发getter方法，可能发生异常
      } else {
        // {},then:{}
        // 常量
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 普通值
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    //executor内部可能会出错，需要try catch
    this.status = PENDING;
    this.value = undefined; // 存储成功后的值
    this.reason = undefined; // 存储失败的原因
    this.resolveCallback = []; // 存储成功的回调
    this.rejectCallback = []; // 存储失败的回调

    const resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        // 当前状态一定是等待态才能改变状态
        this.value = value;
        this.status = FULFILLED;
        // 发布
        this.resolveCallback.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTRD;
        this.rejectCallback.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  // then中的参数是可选的
  then(onFulfilled, onRejected) {
    // 值的穿透
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    let promise2 = new Promise((resolve, reject) => {
      // 把之前的代码全部放在新的promise里面，因为promise执行器是立即执行的
      // 这样方便上一个then的返回值传递到下一个then中
      if (this.status === PENDING) {
        // 先订阅
        // 代码异步调用resolve或者reject时
        this.resolveCallback.push(() => {
          // 切片编程 AOP
          // todo。。。 可以做其他自己的事情
          setTimeout(() => {
            // 等待new Promise 执行完毕才开始执行
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject); // new 的时候promise2还没生成，因此得异步执行此方法
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.rejectCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            // 对应情况二
            let x = onFulfilled(this.value);
            // 此x可能是promise
            // 如果是返回的是promise，则判断这个promise是走成功还是失败
            // 方法：调用此promise的then方法，如果成功则把成功的结果通过调用promise2的resovle传递进去，失败同理
            // 总结：x的值决定是调用promise2（的成功还是失败）的resolve还是reject，如果是promise则取他的状态，如果是普通值则调用resolve
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === REJECTRD) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });
    return promise2;
  }
  //static 静态方法，即通过类直接调用
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }
  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  }
  catch(errorFn) {
    return this.then(null, errorFn);
  }
  static all = function (promises) {
    return new Promise((resolve, reject) => {
      let result = [];
      let times = 0;
      const processSuccess = (index, val) => {
        result[index] = val;
        if (++times === promises.length) {
          resolve(result);
        }
      };
      for (let i = 0; i < promises.length; i++) {
        // 并发 多个请求一起执行的
        let p = promises[i];
        console.log(p && typeof p.then === "function");
        if (p && typeof p.then === "function") {
          p.then((data) => {
            processSuccess(i, data);
          }, reject); // 如果其中某一个promise失败了 直接执行失败即可
        } else {
          processSuccess(i, p);
        }
      }
    });
  };
}
// 测试入口  npm install promises-aplus-tests -g
// 延迟方法
// 保证promise写得是否符合规范
// 帮我们减少一次调用：针对目前来说，应用不是很广泛
// deferred原生方法没有
Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

// node 导出方法
module.exports = Promise;
