import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

export const TopBar: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, width: "100%", marginBottom: "1rem" }}>
      <AppBar position="static">
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
        </Toolbar>
      </AppBar>
    </Box>
  );
};
