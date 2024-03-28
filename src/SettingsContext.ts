import { createContext } from "react";

type SettingsContextType = {
  highlightNegatives: boolean;
  setHighlightNegatives: (highlightNegatives: boolean) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  highlightNegatives: false,
  setHighlightNegatives: () => void 0,
});
