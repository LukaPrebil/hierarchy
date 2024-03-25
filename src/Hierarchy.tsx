import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { RootNode } from "./hierarchy.helpers";

const format = d3.format(",");
const nodeSize = 20;
const width = 928;

const HierarchyTree = ({ data }: { data: RootNode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);


  const [root, setRoot] = useState(() => {
    let i = 0;
    return d3.hierarchy(data).eachBefore((node) => (node.data.index = i++))
  });

  useEffect(() => {
      const allNodes = root.descendants();

      const height = (allNodes.length + 1) * nodeSize;

      const svg = prepareSvg(svgRef, height, root);
      console.log("Drawing tree")
      svg.selectAll("g").remove();
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
        .attr("fill", (d) => (d.children ? null : "#555"))
        .data(
          root
            // .copy()
            .sum((node) => node.value ?? 0)
        )
        .text((d) => format(d.data.value ?? d.value ?? 0));

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
          if (element.classList.contains("skip")) {
            setRoot((prev) => {
              const newRoot = prev.copy();
              const node = newRoot.find((node) => node.data.index === d.data.index)!;
              if (d.data.originalValue === undefined) node.data.originalValue = node.data.value;
              node.data.value = 0;
              return newRoot;
            });
          } else if (element.classList.contains("reset")) {
            setRoot((prev) => {
              const newRoot = prev.copy();
              const node = newRoot.find((node) => node.data.index === d.data.index)!;
              node.data.value = d.data.originalValue ?? node.data.value;
              delete d.data.originalValue;
              return newRoot;
            });
          } else if (element.classList.contains("reverse")) {
            setRoot((prev) => {
              const newRoot = prev.copy();
              const node = newRoot.find((node) => node.data.index === d.data.index)!;
              if (node.data.originalValue === undefined) node.data.originalValue = node.data.value;
              if (!node.data.reversed) {
                node.data.reversed = true;
                console.log("reversing", node.data.value, -node.data.value!);
                node.data.value = -node.data.value!;
              } else {
                node.data.reversed = false;
                console.log("removing flag");
              }
              return newRoot;
            })
          }
          return;
        }
      });

      svgRef.current = svg.node();
  }, [root]);

  return <svg ref={svgRef} />;
};

export default HierarchyTree;

function prepareSvg(
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  height: number,
  root: d3.HierarchyNode<RootNode>
) {
  const svg = d3
    .select(svgRef.current)
    .attr("viewBox", [-nodeSize / 2, (-nodeSize * 3) / 2, width, height])
    .attr(
      "style",
      "max-width: 100%; height: auto; font: 10px sans-serif; overflow: visible;"
    );

  // Create the vertical and horizontal lines for the tree
  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#999")
    .selectAll()
    .data(root.links())
    .join("path")
    .attr(
      "d",
      (d) => `M${d.source.depth * nodeSize},${d.source.data.index! * nodeSize}
             V${d.target.data.index! * nodeSize}
             h${nodeSize}`
    );

  svg.selectAll("text").remove();
  svg
    .append("text")
    .attr("dy", "0.32em")
    .attr("y", -nodeSize)
    .attr("x", 280)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Value");
  return svg;
}
