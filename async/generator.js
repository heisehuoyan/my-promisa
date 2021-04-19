// 回调的方式 callback seTimeout  ... 会有回调地狱问题

// 解决回调地狱：promise只是优化了一下，并没有完全解决
// generator 可以吧函数的执行权交出去 *  yield
// async await 基于generator，是generator的语法糖

let regeneratorRuntime = {
  mark(genFn) {
    return genFn;
  },
  wrap(iteratorFn) {
    const context = {
      next: 0,
      done: false, // 表示迭代器没有完成
      stop() {
        this.done = true;
      },
    };
    let it = {};
    it.next = function (v) {
      // 用户调用的next方法
      context.sent = v;
      let value = iteratorFn(context);
      return {
        value,
        done: context.done, // 是否完成
      };
    };
    return it;
  },
};
("use strict");

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(read);

function read() {
  var a, b, c;
  return regeneratorRuntime.wrap(function read$(_context) {
    switch ((_context.prev = _context.next)) {
      case 0:
        _context.next = 2;
        return 1;

      case 2:
        a = _context.sent;
        console.log("a", a);
        _context.next = 6;
        return 2;

      case 6:
        b = _context.sent;
        console.log("b", b);
        _context.next = 10;
        return 3;

      case 10:
        c = _context.sent;
        console.log("c", c);

      case 12:
      case "end":
        return _context.stop();
    }
  }, _marked);
}

function* run() {
  // 执行结果是一个迭代器
  let w = yield 1; // 调用next的时候遇到yield就停止了，
  console.log("w" + w);
  let y = yield 2;
  console.log("y" + y);
  let z = yield 3;
  console.log("z" + z);
}

let it = run(); // it是个迭代器，对象    {next,}

let value;
let done;
{
  let { value, done } = it.next(33);
  console.log(value, done);
}
{
  let { value, done } = it.next(334);
  console.log(value, done);
}
// it.next(334);
// do {
//   // 至少要执行一次
//   let { value: v, done: d } = it.next(value);
//   value = v;
//   done = d;
//   console.log("我执行了多少次？");
// } while (!done);

// 场景   读取a.txt再读取b.txt，得出结果b
