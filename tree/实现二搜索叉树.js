// 左孩子比根小，右孩子比根大

// 节点 记录存的数据，
// 目前没有考虑想等值的插入，根据需求
class Node {
  constructor(element, parent, left, right) {
    this.element = element; // 当前数据
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}
// 树
class Tree {
  constructor() {
    this.root = null;
  }
  add2(element) {
    if (this.root === null) {
      // 确认根结点
      return (this.root = new Node(element));
    }
    // 可以递归
    const fn = function (currentNode) {
      let compare = element < currentNode.element;
      if (compare) {
        if (currentNode.left) {
          fn(currentNode.left);
        } else {
          currentNode.left = new Node(element, currentNode);
        }
      } else {
        if (currentNode.right) {
          fn(currentNode.right);
        } else {
          currentNode.right = new Node(element, currentNode);
        }
      }
    };
    fn(this.root);
  }
  // 可以循环，
  add(element) {
    if (this.root === null) {
      // 确认根结点
      return (this.root = new Node(element));
    }
    let currentNode = this.root; // 更新当前节点
    let parent;
    let compare; // 放左还是放右
    while (currentNode) {
      parent = currentNode; // 遍历前先记录节点
      compare = element < currentNode.element;
      if (compare) {
        // 比根结点小
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    let node = new Node(element, parent);
    if (compare) {
      parent.left = node;
    } else {
      parent.right = node;
    }
  }
}

let tree = new Tree();
let tree2 = new Tree();
const arr = [3, 4, 1, 8, 90, 2, 46];
arr.forEach((element) => {
  tree.add(element);
});
arr.forEach((element) => {
  tree2.add2(element);
});
console.dir(tree, { depth: 1000 });
console.dir(tree2, { depth: 1000 });
