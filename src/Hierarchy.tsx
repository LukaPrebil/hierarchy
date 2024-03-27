import * as d3 from "d3";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { RootNode } from "./utils/hierarchy.helpers";
import { SettingsContext } from "./SettingsContext";
import { useTheme } from "@mui/material/styles";

const format = d3.format(",.2f");
const width = 380; // Width of the svg, 380 seems like a good width for the kind of data, but it could be calculated based on the max depth of the tree

const HierarchyTree = ({ data }: { data: RootNode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { fontSize, highlightNegatives } = useContext(SettingsContext);
  const nodeHeight = fontSize + 10;

  const theme = useTheme();

  const { root, allNodes, height } = useMemo(() => {
    let i = 0;
    const root = d3
      .hierarchy(data)
      .eachBefore((node) => (node.data.index = i++));
    const allNodes = root.descendants();
    return {
      root,
      allNodes,
      height: (allNodes.length + 1) * nodeHeight,
    };
  }, [data, nodeHeight]);

  const [updateId, setUpdateId] = useState(0);

  useEffect(() => {
    const svg = prepareSvg(svgRef, root, { height, nodeHeight });
    console.log("Drawing tree", allNodes);
    svg.selectAll("g").filter("*:not(#links)").remove();
    // Create the nodes
    const nodes = svg
      .append("g")
      .selectAll()
      .data(allNodes)
      .join("g")
      .attr("transform", (d) => `translate(0,${d.data.index! * nodeHeight})`);

    // append circle to node output, located at the depth of the node
    nodes
      .append("circle")
      .attr("cx", (d) => d.depth * nodeHeight)
      .attr("r", 2.5)
      .attr("fill", (d) => (d.children ? null : "#999"));

    // append name to node output
    nodes
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeHeight + 6)
      .text((d) => d.data.name);

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

    nodes.on("click", (event: PointerEvent, d) => {
      event.preventDefault();
      console.log(updateId);
      const nodeIsLeaf = !d.children;
      const element = event.target as SVGGElement;
      if (nodeIsLeaf) {
        updateLeafNode(element, setUpdateId, d);
      } else {
        updateLeafsUnderNode(element, setUpdateId, d);
      }
    });

    svgRef.current = svg.node();
  }, [
    allNodes,
    height,
    highlightNegatives,
    nodeHeight,
    root,
    theme.palette.error.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
    updateId,
  ]);

  return <svg ref={svgRef} />;
};

export default HierarchyTree;

type HNode = d3.HierarchyNode<RootNode>;

// TODO turn this into a reducer
function updateLeafNode(
  element: SVGGElement,
  setUpdateId: React.Dispatch<React.SetStateAction<number>>,
  clickedLeaf: HNode,
) {
  updateLeaf(element, clickedLeaf);
  setUpdateId((prev) => prev + 1);
}

function updateLeafsUnderNode(
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

function prepareSvg(
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  root: d3.HierarchyNode<RootNode>,
  config: { height: number; nodeHeight: number },
) {
  const svg = d3
    .select(svgRef.current)
    .attr("viewBox", [
      -config.nodeHeight / 2,
      (-config.nodeHeight * 3) / 2,
      width,
      config.height,
    ])
    .attr("style", `overflow: visible;`);

  // Create the vertical and horizontal links for the tree
  svg.selectAll("g").filter("#links").remove();
  svg
    .append("g")
    .attr("id", "links")
    .attr("fill", "none")
    .attr("stroke", "#999")
    .selectAll()
    .data(root.links())
    .join("path")
    .attr(
      "d",
      (d) => `M${d.source.depth * config.nodeHeight},${
        d.source.data.index! * config.nodeHeight
      }
             V${d.target.data.index! * config.nodeHeight}
             h${config.nodeHeight}`,
    );

  svg.selectAll("text").filter("#value-text").remove();
  svg.selectAll("text").filter("#actions-text").remove();
  svg
    .append("text")
    .attr("id", "value-text")
    .attr("dy", "0.32em")
    .attr("y", -config.nodeHeight)
    .attr("x", 280)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Value");

  svg
    .append("text")
    .attr("id", "actions-text")
    .attr("dy", "0.32em")
    .attr("y", -config.nodeHeight)
    .attr("x", 340)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Actions");
  return svg;
}
