import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { convertToHierarchy } from "./utils/hierarchy.helpers.ts";
import { hierarchy as testHierarchy } from "./utils/test-data.ts";
import HierarchyTree from "./components/Hierarchy.tsx";
import { TopBar } from "./components/TopBar.tsx";
import { SettingsContext } from "./SettingsContext";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { FontPicker } from "./components/FontPicker.tsx";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { generateTestData } from "./utils/bigHierarchy.generator.ts";

const testData = generateTestData(10000, 10);

const GridItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing("2rem"),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

function App() {
  const hierarchy = useMemo(
    // () => convertToHierarchy(testHierarchy || testData),
    () => convertToHierarchy(testData || testHierarchy),
    [],
  );

  const [, startTransition] = useTransition();

  const [font, setFont] = useState("Roboto");
  const fontDeffered = useDeferredValue(font);

  const [fontSize, setFontSize] = useState(12);
  const fontSizeDeffered = useDeferredValue(fontSize);

  const [isBold, setIsBold] = useState(false);
  const isBoldDeffered = useDeferredValue(isBold);

  const [highlightNegatives, setHighlightNegatives] = useState(false);
  const highlightNegativesDeffered = useDeferredValue(highlightNegatives);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: fontDeffered,
          fontWeightBold: isBoldDeffered ? "bold" : "normal",
        },
      }),
    [fontDeffered, isBoldDeffered],
  );

  return (
    <SettingsContext.Provider
      value={{
        highlightNegatives: highlightNegativesDeffered,
        setHighlightNegatives,
      }}
    >
      <ThemeProvider theme={theme}>
        <TopBar />
        <Container maxWidth="xl">
          <Grid2 container spacing={2}>
            <Grid2 xs={12} sm={5} md={2}>
              <GridItem
                sx={{
                  position: "sticky",
                  top: "0rem",
                }}
              >
                <h2>Node modifiers (legend)</h2>
                <Divider />
                <List>
                  <ListItem>
                    <ListItemText primary="Square: Reset node" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Circle: Skip node" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Star: Invert node" />
                  </ListItem>
                </List>
              </GridItem>
            </Grid2>
            <Grid2 xs={12} sm={7} md={3}>
              <GridItem
                sx={{
                  position: "sticky",
                  top: "0rem",
                }}
              >
                <h2>Page modifiers</h2>
                <Divider />
                <FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        value={highlightNegatives}
                        onChange={(e) =>
                          startTransition(() =>
                            setHighlightNegatives(e.target.checked),
                          )
                        }
                      />
                    }
                    label="Highlight negatives"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        value={isBold}
                        onChange={(e) =>
                          startTransition(() => setIsBold(e.target.checked))
                        }
                      />
                    }
                    label="Bold"
                  />
                  <FontPicker
                    font={font}
                    setFont={(font) => startTransition(() => setFont(font))}
                  />
                  <FormControlLabel
                    control={
                      <TextField
                        type="number"
                        color="secondary"
                        value={fontSize}
                        inputProps={{ min: 10, max: 15 }}
                        onChange={(e) =>
                          startTransition(() =>
                            setFontSize(parseInt(e.target.value)),
                          )
                        }
                      />
                    }
                    label="Font Size"
                  />
                </FormControl>
              </GridItem>
            </Grid2>
            <Grid2 xs={12} sm={12} md={7}>
              <GridItem
                sx={{
                  "& > svg": {
                    fontFamily: fontDeffered,
                    fontSize: fontSizeDeffered,
                    fontWeight: isBoldDeffered ? "bold" : "normal",
                  },
                }}
              >
                <HierarchyTree data={hierarchy} />
              </GridItem>
            </Grid2>
          </Grid2>
        </Container>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

export default App;
