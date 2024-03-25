import { FC, ReactNode, useMemo } from "react";
import "./App.css";
import { convertToHierarchy } from "./hierarchy.helpers";
import { hierarchy as testHierarchy } from "./test-data";
import HierarchyTree from "./Hierarchy";
import { TopBar } from "./TopBar";

const Container: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="container">{children}</div>;
};

function App() {
  const hierarchy = useMemo(() => convertToHierarchy(testHierarchy), []);

  return (
    <Container>
      <TopBar />
      <HierarchyTree data={hierarchy} />
    </Container>
  );
}

export default App;
