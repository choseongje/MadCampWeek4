"use client";

import React, { useRef } from "react";
import styles from "../styles/ColorPicker.module.css";

interface ColorPickerProps {
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div className={styles.colorPickerContainer}>
      <button className={styles.colorButton} onClick={handleEmojiClick}>🎨</button>
      <input
        type="color"
        ref={colorInputRef}
        onChange={(e) => onChange(e.target.value)}
        className={styles.colorInput}
      />
    </div>
  );
};

export default ColorPicker;
