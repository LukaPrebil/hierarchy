import React from "react";

export const FontPicker = () => {
  const fonts = React.useMemo(() => {
    const fonts = document.fonts.values();
    return new Set([...fonts].map((font) => font.family));
  }, []);

  return (
    <select>
        {[...fonts].map((font) => (
            <option key={font} value={font}>
            {font}
            </option>
        ))}
    </select>
  )
};
