import { useEffect, useState } from "react";
import { RootNode } from "../utils/hierarchy.helpers";
import {
  FormatFn,
  calculateNodesValues,
  updateLeafNode,
} from "../utils/nodesManipulation";
import d3 from "d3";

/**
 * Calculates the values for each node in the hierarchy, and adds the text to the SVG.
 * Separately also adds the click event to the nodes, which is used to modify the data.
 */
export function useCalculateNodesValues(
  svgRef: React.MutableRefObject<SVGSVGElement | null>,
  preparedSvg:
    | d3.Selection<SVGSVGElement | null, unknown, null, undefined>
    | undefined,
  nodes:
    | d3.Selection<
        SVGGElement | null,
        d3.HierarchyNode<RootNode>,
        SVGGElement,
        unknown
      >
    | undefined,
  root: d3.HierarchyNode<RootNode>,
  format: FormatFn,
) {
  const [numOfNegativeNodes, setNumOfNegativeNodes] = useState(0);
  useEffect(() => {
    // This basically only runs once, when the component is mounted
    if (preparedSvg && nodes) {
      preparedSvg.selectAll("text").filter(".value").remove(); // Cleanup all the data text between renders
      calculateNodesValues(nodes, root, format);
      svgRef.current = preparedSvg.node();
      setNumOfNegativeNodes(nodes.filter((d) => d.value! < 0).size());
    }
  }, [format, nodes, preparedSvg, root, svgRef]);

  useEffect(() => {
    nodes?.on("click", (event: PointerEvent, d) => {
      event.preventDefault();
      const operation = getOperation(event.target as SVGElement)!;
      updateNode(d, operation, nodes, format);
      d.ancestors().forEach((ancestor) => {
        const node = nodes.filter((d) => d.data.index === ancestor.data.index);
        node.select("text.value").remove();
        node
          .append("text")
          .attr("class", "value")
          .attr("dy", "0.32em")
          .attr("x", 280)
          .attr("text-anchor", "end")
          .data(ancestor.sum((d) => d.value!))
          .text((d) => format(d.value!));
      });
      setNumOfNegativeNodes(nodes.filter((d) => d.value! < 0).size());
    });
  }, [format, nodes, preparedSvg, root, svgRef]);

  return numOfNegativeNodes;
}

function getOperation(element: SVGElement) {
  if (element.classList.contains("skip")) {
    return "skip";
  }
  if (element.classList.contains("reset")) {
    return "reset";
  }
  if (element.classList.contains("reverse")) {
    return "reverse";
  }
}

function updateNode(
  d: d3.HierarchyNode<RootNode>,
  operation: "skip" | "reset" | "reverse",
  nodes: d3.Selection<
    SVGGElement | null,
    d3.HierarchyNode<RootNode>,
    SVGGElement,
    unknown
  >,
  format: FormatFn,
) {
  if (!d.children) {
    updateLeafNode(operation, d);
  } else {
    d.children.forEach((descendant) => {
      updateNode(descendant, operation, nodes, format);
    });
  }
  const node = nodes.filter((n) => n.data.index === d.data.index);
  node.select("text.value").remove();
  node
    .append("text")
    .attr("class", "value")
    .attr("dy", "0.32em")
    .attr("x", 280)
    .attr("text-anchor", "end")
    .data(d.sum((d) => d.value!))
    .text((d) => format(d.value!));
}
