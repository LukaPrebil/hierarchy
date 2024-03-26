import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FormControlLabel } from "@mui/material";

type FontPickerProps = {
    font: string;
    setFont: (font: string) => void;
}

export const FontPicker: React.FC<FontPickerProps> = ({font, setFont}) => {
  const fonts = React.useMemo(() => {
    const fonts = document.fonts.values();
    return new Set([...fonts].map((font) => font.family));
  }, []);

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
                <MenuItem key={font} value={font}>{font}</MenuItem>
            ))}
          </Select>
        } />
    </>
  );
};
