import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { RootNode } from "./hierarchy.helpers";

const format = d3.format(",");
const nodeSize = 20;
const width = 928;

const HierarchyTree = ({ data }: { data: RootNode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data) {
      let i = 0;
      const root = d3
        .hierarchy(data)
        .eachBefore((node) => (node.data.index = i++));
      const nodes = root.descendants();

      const height = (nodes.length + 1) * nodeSize;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
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
          (d) =>
            `M${d.source.depth * nodeSize},${d.source.data.index! * nodeSize}
             V${d.target.data.index! * nodeSize}
             h${nodeSize}`
        );

      svg
        .append("text")
        .attr("dy", "0.32em")
        .attr("y", -nodeSize)
        .attr("x", 280)
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text("Value");

      // Create the nodes
      const node = svg
        .append("g")
        .selectAll()
        .data(nodes)
        .join("g")
        .attr("transform", (d) => `translate(0,${d.data.index! * nodeSize})`);

      // append circle to node output, located at the depth of the node
      node
        .append("circle")
        .attr("cx", (d) => d.depth * nodeSize)
        .attr("r", 2.5)
        .attr("fill", (d) => (d.children ? null : "#999"));

      // append name to node output
      node
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", (d) => d.depth * nodeSize + 6)
        .text((d) => d.data.name);

      node
        .append("text")
        .attr("dy", "0.32em")
        .attr("x", 280)
        .attr("text-anchor", "end")
        .attr("fill", (d) => (d.children ? null : "#555"))
        .data(
          root
            .copy()
            .sum((node) => node.value ?? 0)
            .descendants()
        )
        .text((d) => format(d.value ?? 0));

      svgRef.current = svg.node();
    }
  }, [data]);

  return <svg ref={svgRef} width={1600} height={1200} />;
};

export default HierarchyTree;
