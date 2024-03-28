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
) {
  const theme = useTheme();
  useEffect(() => {
    console.log("useEffect negative highlights");
    console.time("negative highlights");
    if (nodes) {
      console.log("adding negative highlights");
      nodes
        .filter((d) => d.value! < 0)
        .attr("fill", (d) => {
          if (highlightNegatives) {
            return theme.palette.error.main;
          } else if (d.children) {
            return theme.palette.text.secondary;
          } else {
            return theme.palette.text.primary;
          }
        });
    }
    console.timeEnd("negative highlights");
  }, [
    highlightNegatives,
    nodes,
    theme.palette.error.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);
}
