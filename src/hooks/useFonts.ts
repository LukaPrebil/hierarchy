import React from "react";

export const useFonts = () => {
  return React.useMemo(() => {
    const fonts = document.fonts.values();
    return new Set([...fonts].map((font) => font.family));
  }, []);
};
