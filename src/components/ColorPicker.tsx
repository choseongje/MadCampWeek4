"use client";

import React from "react";

interface ColorPickerProps {
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  return (
    <input type="color" onChange={(e) => onChange(e.target.value)} />
  );
};

export default ColorPicker;
