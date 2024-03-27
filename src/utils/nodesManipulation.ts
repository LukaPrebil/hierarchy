import * as d3 from "d3";
import type { RootNode } from "./hierarchy.helpers";
import { Theme } from "@mui/material/styles";

type Nodes = d3.Selection<
  SVGGElement | null,
  d3.HierarchyNode<RootNode>,
  SVGGElement,
  unknown
>;

type FormatFn = (
  n:
    | number
    | {
        valueOf(): number;
      },
) => string;

export function createNodes(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  allNodes: d3.HierarchyNode<RootNode>[],
  nodeHeight: number,
) {
  return svg
    .append("g")
    .selectAll()
    .data(allNodes)
    .join("g")
    .attr("transform", (d) => `translate(0,${d.data.index! * nodeHeight})`);
}

export function addCirclesToNodes(nodes: Nodes, nodeHeight: number) {
  nodes
    .append("circle")
    .attr("cx", (d) => d.depth * nodeHeight) // Move the circle to the right based on the depth
    .attr("r", 2.5)
    .attr("fill", (d) => (d.children ? null : "#999"));
}

export function addNodeName(nodes: Nodes, nodeHeight: number) {
  nodes
    .append("text")
    .attr("dy", "0.32em")
    .attr("x", (d) => d.depth * nodeHeight + 6)
    .text((d) => d.data.name);
}

export function addNodeActionIcons(nodes: Nodes, nodeHeight: number) {
  nodes
    .append("path")
    .attr("class", "reset")
    .attr("d", d3.symbol(d3.symbolSquare).size(nodeHeight))
    .attr("transform", "translate(305,0)")
    .attr("fill", "black");

  nodes
    .append("path")
    .attr("class", "skip")
    .attr("d", d3.symbol(d3.symbolCircle).size(nodeHeight))
    .attr("transform", "translate(320,0)")
    .attr("fill", "black");

  nodes
    .append("path")
    .attr("class", "reverse")
    .attr("d", d3.symbol(d3.symbolStar).size(nodeHeight))
    .attr("transform", "translate(335,0)")
    .attr("fill", "black");
}

export function calculateNodesValues(
  nodes: Nodes,
  root: d3.HierarchyNode<RootNode>,
  format: FormatFn,
  highlightNegatives: boolean,
  theme: Theme,
) {
  nodes
    .append("text")
    .attr("dy", "0.32em")
    .attr("x", 280)
    .attr("text-anchor", "end")
    .data(root.sum((d) => d.value!))
    .text((d) => format(d.value!))
    .attr("fill", (d) => {
      if (highlightNegatives && d.value! < 0) {
        return theme.palette.error.main;
      } else if (d.children) {
        return theme.palette.text.secondary;
      } else {
        return theme.palette.text.primary;
      }
    });
}

type HNode = d3.HierarchyNode<RootNode>;

// TODO turn this into a reducer
export function updateLeafNode(
  element: SVGGElement,
  setUpdateId: React.Dispatch<React.SetStateAction<number>>,
  clickedLeaf: HNode,
) {
  updateLeaf(element, clickedLeaf);
  setUpdateId((prev) => prev + 1);
}

export function updateLeafsUnderNode(
  element: SVGGElement,
  setUpdateId: React.Dispatch<React.SetStateAction<number>>,
  clickedNode: HNode,
) {
  clickedNode.descendants().forEach((descendant) => {
    if (descendant.children) return; // skip non-leaf nodes as their value gets calculated from children
    updateLeaf(element, descendant);
  });
  setUpdateId((prev) => prev + 1);
}

// TODO take leaf.data, return new leaf.data
function updateLeaf(element: SVGGElement, leaf: HNode) {
  if (element.classList.contains("skip")) {
    if (leaf.data.originalValue === undefined)
      leaf.data.originalValue = leaf.data.value;
    leaf.data.value = 0;
  }
  if (element.classList.contains("reset")) {
    leaf.data.value = leaf.data.originalValue ?? leaf.data.value;
    delete leaf.data.originalValue;
  }
  if (element.classList.contains("reverse")) {
    if (leaf.data.originalValue === undefined)
      leaf.data.originalValue = leaf.data.value;
    if (!leaf.data.reversed) {
      leaf.data.reversed = true;
      console.log("reversing", leaf.data.value, -leaf.data.value!);
      leaf.data.value = -leaf.data.value!;
    } else {
      leaf.data.reversed = false;
      console.log("removing flag");
    }
  }
}
