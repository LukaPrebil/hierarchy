import { useEffect, useState } from "react";
import { prepareSvg } from "../utils/prepareBaseSVG";
import { RootNode } from "../utils/hierarchy.helpers";

/**
 * Prepares the basic structure of the SVG and adds the links between the nodes.
 */
export function usePreparedSvg(
  svgRef: React.RefObject<SVGSVGElement>,
  root: d3.HierarchyNode<RootNode>,
  width: number,
  height: number,
  nodeHeight: number,
) {
  const [preparedSvg, setPreparedSvg] =
    useState<ReturnType<typeof prepareSvg>>();

  useEffect(() => {
    setPreparedSvg(prepareSvg(svgRef, root, { width, height, nodeHeight }));
  }, [height, nodeHeight, root, svgRef, width]);

  return preparedSvg;
}
