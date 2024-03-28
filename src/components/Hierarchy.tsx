import * as d3 from "d3";
import { useContext, useRef } from "react";
import { RootNode } from "../utils/hierarchy.helpers";
import { SettingsContext } from "../SettingsContext";
import { useD3Hierarchy } from "../hooks/useD3Hierarchy";
import { usePreparedSvg } from "../hooks/usePreparedSvg";
import { useCreateNodes } from "../hooks/useCreateNodes";
import { useStaticNodeData } from "../hooks/useStaticNodeData";
import { useHighlightNegatives } from "../hooks/useHighlightNegatives";
import { useCalculateNodesValues } from "../hooks/useCalculateNodesValues";

const format = d3.format(",.2f"); // Format the numbers to 2 decimal places
const width = 380; // Width of the svg, 380 seems like a good width for the kind of data, but it could be calculated based on the max depth of the tree
const nodeHeight = 25; // Max font size 15 + 10 padding

const HierarchyTree = ({ data }: { data: RootNode }) => {
  const { highlightNegatives } = useContext(SettingsContext);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { root, allNodes } = useD3Hierarchy(data);
  const height = (allNodes.length + 1) * nodeHeight;

  const preparedSvg = usePreparedSvg(svgRef, root, width, height, nodeHeight);
  const nodes = useCreateNodes(preparedSvg, allNodes, nodeHeight);

  useStaticNodeData(nodes, nodeHeight);
  const numOfNegativeNodes = useCalculateNodesValues(
    svgRef,
    preparedSvg,
    nodes,
    root,
    format,
  );
  useHighlightNegatives(nodes, highlightNegatives, numOfNegativeNodes);

  return <svg ref={svgRef} />;
};

export default HierarchyTree;
