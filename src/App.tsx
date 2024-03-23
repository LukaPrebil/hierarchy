import { useMemo } from "react";
import "./App.css";
import { convertToHierarchy } from "./hierarchy.helpers";
import { hierarchy as testHierarchy } from "./test-data";
import HierarchyTree from "./Hierarchy";

function App() {
  const hierarchy = useMemo(() => convertToHierarchy(testHierarchy), []);
  console.log(JSON.stringify(hierarchy, null, 2));

  return <HierarchyTree data={hierarchy} />;
}

export default App;
