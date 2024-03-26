import { FC, ReactNode, useMemo, useState } from "react";
import { convertToHierarchy } from "./hierarchy.helpers";
import { hierarchy as testHierarchy } from "./test-data";
import HierarchyTree from "./Hierarchy";
import { TopBar } from "./TopBar";
import { SettingsContext } from "./SettingsContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Container: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="container">{children}</div>;
};

function App() {
  const hierarchy = useMemo(() => convertToHierarchy(testHierarchy), []);

  const [font, setFont] = useState("Roboto");
  const [fontSize, setFontSize] = useState(14);
  const [isBold, setIsBold] = useState(false);
  const [highlightNegatives, setHighlightNegatives] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: font,
          fontWeightBold: isBold ? "bold" : "normal",
        },
      }),
    [font, isBold]
  );

  return (
    <SettingsContext.Provider
      value={{
        font,
        setFont,
        fontSize,
        setFontSize,
        isBold,
        setIsBold,
        highlightNegatives,
        setHighlightNegatives,
      }}
    >
      <ThemeProvider theme={theme}>
        <Container>
          <TopBar />
          <HierarchyTree data={hierarchy} />
        </Container>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

export default App;
