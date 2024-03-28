import { useEffect, useState } from "react";
import { RootNode } from "../utils/hierarchy.helpers";
import {
  FormatFn,
  calculateNodesValues,
  updateLeafNode,
  updateLeafsUnderNode,
} from "../utils/nodesManipulation";

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
  const [updateId, setUpdateId] = useState(0);

  useEffect(() => {
    console.log("useEffect nodes dynamic");
    console.time(`calculateNodesValues ${updateId}`);
    if (preparedSvg && nodes) {
      console.log("updating nodes dynamic");
      preparedSvg.selectAll("text").filter(".value").remove(); // Cleanup all the data text between renders

      calculateNodesValues(nodes, root, format);

      svgRef.current = preparedSvg.node();
      console.timeEnd(`calculateNodesValues ${updateId}`);
    }
  }, [format, nodes, preparedSvg, root, svgRef, updateId]);

  useEffect(() => {
    nodes?.on("click", (event: PointerEvent, d) => {
      event.preventDefault();
      const nodeIsLeaf = !d.children;
      const element = event.target as SVGGElement;
      if (nodeIsLeaf) {
        updateLeafNode(element, setUpdateId, d);
      } else {
        updateLeafsUnderNode(element, setUpdateId, d);
      }
    });
  }, [nodes]);
}
