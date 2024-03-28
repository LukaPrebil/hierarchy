import { useEffect, useState } from "react";
import { createNodes } from "../utils/nodesManipulation";
import { RootNode } from "../utils/hierarchy.helpers";

/**
 * Creates a group for each node in the hierarchy, and moves it to the right position.
 */
export function useCreateNodes(
  preparedSvg:
    | d3.Selection<SVGSVGElement | null, unknown, null, undefined>
    | undefined,
  allNodes: d3.HierarchyNode<RootNode>[],
  nodeHeight: number,
) {
  const [nodes, setNodes] = useState<ReturnType<typeof createNodes>>();

  useEffect(() => {
    if (preparedSvg) {
      setNodes(createNodes(preparedSvg, allNodes, nodeHeight));
    }
  }, [allNodes, nodeHeight, preparedSvg]);

  return nodes;
}
