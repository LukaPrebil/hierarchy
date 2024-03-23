export type LeafNode = {
  [key: string]: number;
};

export type InnerNode = {
  [key: string]: (InnerNode | LeafNode)[];
};

export type TreeNode = (InnerNode | LeafNode)[];

export const hierarchy: TreeNode = [
  { Q2: 10 },
  {
    Q3: [
      {
        Jul: 113.4,
      },
      {
        Aug: 46.4,
      },
      {
        Sep: 42.7,
      },
    ],
  },
  {
    Q4: [
      { Sep: [{ w1: 1 }, { w2: 2 }] },
      {
        Oct: 115.5,
      },
      {
        Nov: 24.8,
      },
      {
        Dec: 97.2,
      },
    ],
  },
];
