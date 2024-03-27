import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";
import { RootNode } from "./utils/hierarchy.helpers";
import { SettingsContext } from "./SettingsContext";
import { useTheme } from "@mui/material/styles";
import { useD3Hierarchy } from "./useD3Hierarchy";
import {
  addCirclesToNodes,
  addNodeActionIcons,
  addNodeName,
  calculateNodesValues,
  createNodes,
  updateLeafNode,
  updateLeafsUnderNode,
} from "./nodesManipulation";
import { prepareSvg } from "./prepareBaseSVG";

const format = d3.format(",.2f"); // Format the numbers to 2 decimal places
const width = 380; // Width of the svg, 380 seems like a good width for the kind of data, but it could be calculated based on the max depth of the tree

const HierarchyTree = ({ data }: { data: RootNode }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const theme = useTheme();
  const { fontSize, highlightNegatives } = useContext(SettingsContext);
  const { root, allNodes } = useD3Hierarchy(data);

  const nodeHeight = fontSize + 10;
  const height = (allNodes.length + 1) * nodeHeight;
  const [updateId, setUpdateId] = useState(0);

  useEffect(() => {
    const svg = prepareSvg(svgRef, root, { width, height, nodeHeight });
    console.log("Drawing tree", allNodes);
    svg.selectAll("g").filter("*:not(#links)").remove(); // Cleanup all the data nodes between renders

    const nodes = createNodes(svg, allNodes, nodeHeight);
    addCirclesToNodes(nodes, nodeHeight);
    addNodeName(nodes, nodeHeight);
    addNodeActionIcons(nodes, nodeHeight);
    calculateNodesValues(nodes, root, format, highlightNegatives, theme);

    nodes.on("click", (event: PointerEvent, d) => {
      event.preventDefault();
      console.log(updateId);
      const nodeIsLeaf = !d.children;
      const element = event.target as SVGGElement;
      if (nodeIsLeaf) {
        updateLeafNode(element, setUpdateId, d);
      } else {
        updateLeafsUnderNode(element, setUpdateId, d);
      }
    });

    svgRef.current = svg.node();
  }, [allNodes, height, highlightNegatives, nodeHeight, root, theme, updateId]);

  return <svg ref={svgRef} />;
};

export default HierarchyTree;
