import React from "react";
import { FontPicker } from "./FontPicker";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import FormControl from "@mui/material/FormControl";
import { SettingsContext } from "./SettingsContext";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

export const TopBar: React.FC = () => {
  const {
    font,
    setFont,
    fontSize,
    setFontSize,
    highlightNegatives,
    setHighlightNegatives,
  } = React.useContext(SettingsContext);

  return (
    <Box sx={{ flexGrow: 1, width: "100%", marginBottom: "1rem" }}>
      <AppBar position="static">
        <FormControl sx={{m: 1, minWidth: 80}}>
          <Toolbar
            sx={{
              height: "5rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Hierarchy
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  value={highlightNegatives}
                  onChange={(e) => setHighlightNegatives(e.target.checked)}
                />
              }
              label="Highlight negatives"
            />
            <FontPicker font={font} setFont={setFont} />
            <TextField
              label="Font Size"
              type="number"
              color="secondary"
              sx={{margin: "1rem"}}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
          </Toolbar>
        </FormControl>
      </AppBar>
    </Box>
  );
};
