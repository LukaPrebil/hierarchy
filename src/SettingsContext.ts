import { createContext } from "react";

type SettingsContextType = {
    font: string;
    setFont: (font: string) => void;
    isBold: boolean;
    setIsBold: (isBold: boolean) => void;
    isItalic: boolean;
    setIsItalic: (isItalic: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
    font: "Roboto",
    setFont: () => void 0,
    isBold: false,
    setIsBold: () => void 0,
    isItalic: false,
    setIsItalic: () => void 0
});