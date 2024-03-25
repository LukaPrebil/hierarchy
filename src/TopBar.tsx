import React from "react";
import "./TopBar.css";
import { FontPicker } from "./FontPicker";

export const TopBar: React.FC = () => {
  return (
    <div className="top-bar">
      <h2>Hierarchy</h2>
      <FontPicker />
    </div>
  );
};
