import { createContext } from "react";

type SettingsContextType = {
    font: string;
    setFont: (font: string) => void;
    fontSize: number;
    setFontSize: (fontSize: number) => void;
    isBold: boolean;
    setIsBold: (isBold: boolean) => void;
    highlightNegatives: boolean;
    setHighlightNegatives: (highlightNegatives: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
    font: "Roboto",
    setFont: () => void 0,
    fontSize: 14,
    setFontSize: () => void 0,
    isBold: false,
    setIsBold: () => void 0,
    highlightNegatives: false,
    setHighlightNegatives: () => void 0,
});