"use client";
import React from "react";
import styles from "./ColorPalette.module.css";

interface ColorPaletteProps {
  colors: string[];
  active: string;
  onChange: (color: string) => void;
}

export default function ColorPalette({ colors, active, onChange }: ColorPaletteProps) {
  return (
    <div className={styles.container}>
      {colors.map(color => (
        <button
          key={color}
          className={`${styles.swatch} ${active === color ? styles.swatchActive : ""}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Select color ${color}`}
        />
      ))}
      <button
        className={`${styles.swatch} ${!colors.includes(active) ? styles.swatchActive : ""}`}
        style={{ 
          background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}
        onClick={() => {
          const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
          onChange(randomColor);
        }}
        aria-label="Random color"
        title="Random Color"
      >
        ✨
      </button>

      {/* Custom Color Picker */}
      <label 
        className={`${styles.swatch} ${!colors.includes(active) && active.length === 7 ? styles.swatchActive : ""}`}
        style={{
          background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        title="Custom Color"
      >
        <div style={{ background: active, width: '60%', height: '60%', borderRadius: '50%', border: '2px solid white' }} />
        <input 
          type="color" 
          value={active.length === 7 ? active : '#ffffff'} 
          onChange={(e) => onChange(e.target.value)}
          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          aria-label="Custom color picker"
        />
      </label>
    </div>
  );
}
