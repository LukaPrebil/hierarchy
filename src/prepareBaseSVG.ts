import * as d3 from "d3";
import { RootNode } from "./utils/hierarchy.helpers";

export function prepareSvg(
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  root: d3.HierarchyNode<RootNode>,
  config: { width: number; height: number; nodeHeight: number },
) {
  const svg = d3
    .select(svgRef.current)
    .attr("viewBox", [
      -config.nodeHeight / 2,
      (-config.nodeHeight * 3) / 2,
      config.width,
      config.height,
    ])
    .attr("style", `overflow: visible;`);

  createLinks(svg, root, config.nodeHeight);
  addColumnHeaders(svg, config.nodeHeight);
  return svg;
}

function createLinks(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  root: d3.HierarchyNode<RootNode>,
  nodeHeight: number,
) {
  svg.selectAll("g").filter("#links").remove();
  // Create the vertical and horizontal links for the tree
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
      (d) => `M${d.source.depth * nodeHeight},${
        d.source.data.index! * nodeHeight
      }
                 V${d.target.data.index! * nodeHeight}
                 h${nodeHeight}`,
    );
}

function addColumnHeaders(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodeHeight: number,
) {
  svg.selectAll("text").filter("#value-text").remove();
  svg.selectAll("text").filter("#actions-text").remove();
  svg
    .append("text")
    .attr("id", "value-text")
    .attr("dy", "0.32em")
    .attr("y", -nodeHeight)
    .attr("x", 280)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Value");

  svg
    .append("text")
    .attr("id", "actions-text")
    .attr("dy", "0.32em")
    .attr("y", -nodeHeight)
    .attr("x", 340)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Actions");
}
