import * as d3 from "d3";
import { RootNode } from "../utils/hierarchy.helpers";
import { useMemo } from "react";

export function useD3Hierarchy(data: RootNode) {
  const { root, allNodes } = useMemo(() => {
    let i = 0;
    const root = d3
      .hierarchy(data)
      .eachBefore((node) => (node.data.index = i++));
    const allNodes = root.descendants();
    return {
      root,
      allNodes,
    };
  }, [data]);

  return { root, allNodes };
}
