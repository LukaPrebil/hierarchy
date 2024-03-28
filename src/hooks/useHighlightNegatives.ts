import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { RootNode } from "../utils/hierarchy.helpers";

/**
 * Highlights the negative nodes in red.
 */
export function useHighlightNegatives(
  nodes:
    | d3.Selection<
        SVGGElement | null,
        d3.HierarchyNode<RootNode>,
        SVGGElement,
        unknown
      >
    | undefined,
  highlightNegatives: boolean,
  numOfNegativeNodes: number,
) {
  const theme = useTheme();
  useEffect(() => {
    if (nodes) {
      nodes.attr("fill", (d) => {
        if (highlightNegatives && d.value! < 0) {
          return theme.palette.error.main;
        } else if (d.children) {
          return theme.palette.text.secondary;
        } else {
          return theme.palette.text.primary;
        }
      });
    }
  }, [
    highlightNegatives,
    nodes,
    numOfNegativeNodes,
    theme.palette.error.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);
}
