import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FormControlLabel } from "@mui/material";
import { useFonts } from "./useFonts";

type FontPickerProps = {
  font: string;
  setFont: (font: string) => void;
};

export const FontPicker: React.FC<FontPickerProps> = ({ font, setFont }) => {
  const fonts = useFonts();

  return (
    <>
      <FormControlLabel
        label="Font"
        control={
          <Select
            id="font-select"
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            {[...fonts].map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        }
      />
    </>
  );
};
