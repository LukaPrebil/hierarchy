import { FC, ReactNode, useMemo, useState } from "react";
import { convertToHierarchy } from "./hierarchy.helpers";
import { hierarchy as testHierarchy } from "./test-data";
import HierarchyTree from "./Hierarchy";
import { TopBar } from "./TopBar";
import { SettingsContext } from "./SettingsContext";

const Container: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="container">{children}</div>;
};

function App() {
  const hierarchy = useMemo(() => convertToHierarchy(testHierarchy), []);

  const [font, setFont] = useState("Roboto");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  return (
    <SettingsContext.Provider
      value={{ font, setFont, isBold, setIsBold, isItalic, setIsItalic }}
    >
      <Container>
        <TopBar />
        <HierarchyTree data={hierarchy} />
      </Container>
    </SettingsContext.Provider>
  );
}

export default App;
