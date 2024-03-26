import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

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
      <InputLabel id="font-select-label">Font</InputLabel>
      <Select
        labelId="font-select-label"
        id="font-select"
        autoWidth
        value={font}
        label="Font"
        onChange={(e) => setFont(e.target.value)}
      >
        {[...fonts].map((font) => (
            <MenuItem key={font} value={font}>{font}</MenuItem>
        ))}
      </Select>
    </>
  );
};
