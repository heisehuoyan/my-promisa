// 怎么遍历一个树
// 先序,先处理根： 遇到节点就处理节点，左边树处理完了处理，处理右边树，并且左右两边的树也是采用先序遍历 根左右
// 后序 ：根节点最后遍历：先遍历左，在右   左右根
// 中序：左根右
// 层序遍历 一层一层遍历

// 性能没有什么差别，只是访问顺序不一样

// 扩展：
// 深度优先 纵向
// 广度优先 横向
class Node {
  constructor(element, parent, left, right) {
    this.element = element; // 当前数据
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}
class Tree {
  constructor() {
    this.root = null;
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
  // 先序   ，
  // 采用递归的话，考虑终止条件
  preTravesal() {
    const fn = function (node) {
      if (node === null) return;
      console.log(node.element);
      fn(node.left);
      fn(node.right);
    };
    fn(this.root);
  }
  // 中序比那里
  inoderTravesal() {
    const fn = function (node) {
      if (node === null) return;
      fn(node.left);
      console.log(node.element);
      fn(node.right);
    };
    fn(this.root);
  }
  // 后序
  poderTravesal() {
    const fn = function (node) {
      if (node === null) return;
      fn(node.left);
      fn(node.right);
      console.log(node.element);
    };
    fn(this.root);
  }
}

let tree = new Tree();
const arr = [3, 4, 1, 8, 90, 2, 46];
arr.forEach((element) => {
  tree.add(element);
});
tree.poderTravesal();
