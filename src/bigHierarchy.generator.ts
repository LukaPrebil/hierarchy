import { TreeNode, InnerNode, LeafNode } from "./test-data";

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateLeafNode(): LeafNode {
  const randomNumber = generateRandomFloat(-10, 100);
  return { [`w${generateRandomNumber(0,4)}`]: randomNumber };
}

function generateInnerNode(maxDepth: number, currentDepth: number): InnerNode {
  const node: InnerNode = {};
  const numChildren = generateRandomNumber(1, 10);

  for (let i = 0; i < numChildren; i++) {
    const key = `Q${generateRandomNumber(1, 10)}`;
    node[key] = [];
    if (currentDepth < maxDepth && Math.random() < 0.3) {
      node[key].push(generateInnerNode(maxDepth, currentDepth + 1));
    } else {
      node[key].push(generateLeafNode());
    }
  }

  return node;
}

export function generateTestData(numNodes: number, maxDepth: number): TreeNode {
  const testData: TreeNode = [];

  for (let i = 0; i < numNodes; i++) {
    if (Math.random() < 0.5) {
      testData.push(generateInnerNode(maxDepth, 1));
    } else {
      testData.push(generateLeafNode());
    }
  }

  return testData;
}

// // Example usage
// const testData = generateTestData(1000, 5);
// console.log(testData);
