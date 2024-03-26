import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import { RootNode } from "./hierarchy.helpers";
import { SettingsContext } from "./SettingsContext";
import { useTheme } from "@mui/material/styles";

const format = d3.format(",");
const width = 928;

const HierarchyTree = ({ data }: { data: RootNode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { font, fontSize, highlightNegatives } = useContext(SettingsContext);
  const nodeSize = fontSize + 10;

  const theme = useTheme();

  const [root, setRoot] = useState(() => {
    let i = 0;
    return d3.hierarchy(data).eachBefore((node) => (node.data.index = i++));
  });

  useEffect(() => {
    const allNodes = root.descendants();

    const height = (allNodes.length + 1) * nodeSize;

    const svg = prepareSvg(svgRef, root, { height, font, fontSize, nodeSize });
    console.log("Drawing tree");
    svg.selectAll("g").filter("*:not(#links)").remove();
    // Create the nodes
    const nodes = svg
      .append("g")
      .selectAll()
      .data(allNodes)
      .join("g")
      .attr("transform", (d) => `translate(0,${d.data.index! * nodeSize})`);

    // append circle to node output, located at the depth of the node
    nodes
      .append("circle")
      .attr("cx", (d) => d.depth * nodeSize)
      .attr("r", 2.5)
      .attr("fill", (d) => (d.children ? null : "#999"));

    // append name to node output
    nodes
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => d.depth * nodeSize + 6)
      .text((d) => d.data.name);

    nodes
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", 280)
      .attr("text-anchor", "end")
      .data(root.sum((node) => node.value ?? 0))
      .text((d) => format(d.data.value ?? d.value ?? 0))
      .attr("fill", (d) => {
        if (highlightNegatives && d.data.value! < 0) {
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
      .attr("d", d3.symbol(d3.symbolAsterisk).size(nodeSize))
      .attr("transform", "translate(100,0)")
      .attr("stroke", "black");

    nodes
      .append("path")
      .attr("class", "skip")
      .attr("d", d3.symbol(d3.symbolAsterisk).size(nodeSize))
      .attr("transform", "translate(110,0)")
      .attr("stroke", "black");

    nodes
      .append("path")
      .attr("class", "reverse")
      .attr("d", d3.symbol(d3.symbolAsterisk).size(nodeSize))
      .attr("transform", "translate(120,0)")
      .attr("stroke", "black");

    nodes.on("click", (event: PointerEvent, d) => {
      event.preventDefault();
      const nodeIsLeaf = !d.children;
      const element = event.target as SVGGElement;
      if (nodeIsLeaf) {
        console.log("clicked leaf", d, event);
        updateLeafNode(element, setRoot, d);
      } else {
        console.log("clicked node", d, event);
        updateLeafsUnderNode(element, setRoot, d);
      }
    });

    svgRef.current = svg.node();
  }, [
    font,
    fontSize,
    nodeSize,
    root,
    highlightNegatives,
    theme.palette.error.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  return <svg ref={svgRef} />;
};

export default HierarchyTree;

type HNode = d3.HierarchyNode<RootNode>;

// TODO turn this into a reducer
function updateLeafNode(
  element: SVGGElement,
  setRoot: React.Dispatch<React.SetStateAction<HNode>>,
  clickedLeaf: HNode
) {
  setRoot((prev) => {
    const newRoot = prev.copy();
    const newLeaf = newRoot.find(
      (node) => node.data.index === clickedLeaf.data.index
    )!;
    updateLeaf(element, newLeaf);
    return newRoot;
  });
}

function updateLeafsUnderNode(
  element: SVGGElement,
  setRoot: React.Dispatch<React.SetStateAction<HNode>>,
  clickedNode: HNode
) {
  setRoot((prev) => {
    const newRoot = prev.copy();
    const node = newRoot.find(
      (node) => node.data.index === clickedNode.data.index
    )!;
    node.descendants().forEach((descendant) => {
      if (descendant.children) return; // skip non-leaf nodes as their value gets calculated from children
      updateLeaf(element, descendant);
    });
    return newRoot;
  });
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
  config: { height: number; font: string; fontSize: number; nodeSize: number }
) {
  const svg = d3
    .select(svgRef.current)
    .attr("viewBox", [
      -config.nodeSize / 2,
      (-config.nodeSize * 3) / 2,
      width,
      config.height,
    ])
    .attr(
      "style",
      `font: ${config.fontSize}px sans-serif; font-family: ${config.font}; overflow: visible;`
    );

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
      (d) => `M${d.source.depth * config.nodeSize},${
        d.source.data.index! * config.nodeSize
      }
             V${d.target.data.index! * config.nodeSize}
             h${config.nodeSize}`
    );

  svg.selectAll("text").filter("#value-text").remove();
  svg
    .append("text")
    .attr("id", "value-text")
    .attr("dy", "0.32em")
    .attr("y", -config.nodeSize)
    .attr("x", 280)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Value");
  return svg;
}
