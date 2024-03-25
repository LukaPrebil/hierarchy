import React from "react";
import { FontPicker } from "./FontPicker";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import FormControl from "@mui/material/FormControl";
import { SettingsContext } from "./SettingsContext";

export const TopBar: React.FC = () => {
  const { font, setFont } = React.useContext(SettingsContext);

  return (
    <Box sx={{ flexGrow: 1, width: "100%", marginBottom: "1rem" }}>
      <AppBar position="static">
        <Toolbar sx={{ height: "5rem", alignItems: "center" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hierarchy
          </Typography>
          <FormControl>
            <FontPicker font={font} setFont={setFont} />
          </FormControl>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
