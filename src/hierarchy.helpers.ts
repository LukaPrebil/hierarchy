import { InnerNode, LeafNode, TreeNode } from "./test-data";

export type RootNode = {
  name: string;
  children: unknown[];
  value?: number;
  index?: number;
};

export type Node = {
  name: string;
  value?: number;
  children?: Node[];
};

/**
 * Converts from the TreeNode type that was received as input to the RootNode type consumable by d3.js
 * @param data Input to exercise
 */
export function convertToHierarchy(data: TreeNode): RootNode {
  const root: RootNode = { name: "root", children: [] };

  data.forEach((node) => {
    root.children.push(convertNode(node));
  });

  return root;
}

function convertNode(node: InnerNode | LeafNode): Node {
  if (isLeafNode(node)) {
    return { name: Object.keys(node)[0], value: Object.values(node)[0] };
  } else {
    return {
      name: Object.keys(node)[0],
      children: Object.values(node)[0].map((child) => convertNode(child)),
    };
  }
}

function isLeafNode(node: InnerNode | LeafNode): node is LeafNode {
  return isNumber(Object.values(node)[0]);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}
