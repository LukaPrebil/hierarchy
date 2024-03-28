import { useEffect } from "react";
import { RootNode } from "../utils/hierarchy.helpers";
import {
  addCirclesToNodes,
  addNodeActionIcons,
  addNodeName,
} from "../utils/nodesManipulation";

/**
 * Fills the nodes with static data, such as the node name and action icons.
 */
export function useStaticNodeData(
  nodes:
    | d3.Selection<
        SVGGElement | null,
        d3.HierarchyNode<RootNode>,
        SVGGElement,
        unknown
      >
    | undefined,
  nodeHeight: number,
) {
  useEffect(() => {
    console.log("useEffect nodes static");
    if (nodes) {
      console.log("adding nodes static", nodes);
      addCirclesToNodes(nodes, nodeHeight);
      addNodeName(nodes, nodeHeight);
      addNodeActionIcons(nodes, nodeHeight);
    }
  }, [nodeHeight, nodes]);
}
