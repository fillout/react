import React, { CSSProperties, useState } from "react";
import { FormParams } from "../embed.js";
import { Popup } from "./Popup.js";

type ButtonSize = "small" | "medium" | "large";

const buttonSizeStyles: {
  [size in ButtonSize]: CSSProperties;
} = {
  small: {
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 28,
  },
  medium: {
    padding: "10px 14px",
    fontSize: 18,
    borderRadius: 32,
  },
  large: {
    padding: "12px 14px",
    fontSize: 20,
    borderRadius: 32,
  },
};

type ButtonFloat = "bottomRight" | "bottomLeft";

const buttonFloatStyles: {
  [float in ButtonFloat]: CSSProperties;
} = {
  bottomRight: {
    position: "fixed",
    bottom: 32,
    right: 32,
    zIndex: 9999999,
  },
  bottomLeft: {
    position: "fixed",
    bottom: 32,
    left: 32,
    zIndex: 9999999,
  },
};

const hexToRgb = (hex: string) => {
  // just in case someone passes in rgba() format, which we used to use in
  // the past in the snippet
  if (
    typeof hex !== "string" ||
    !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  ) {
    return [59, 130, 246]; // default color values for '#3b82f6'
  }

  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return [r, g, b];
};

const getLuminance = (hexColor: string) => {
  let [r, g, b] = hexToRgb(hexColor);
  // Calculate relative luminance
  // sRGB formula
  const getComponent = (color: number) => {
    color /= 255;
    return color <= 0.03928
      ? color / 12.92
      : Math.pow((color + 0.055) / 1.055, 2.4);
  };

  r = getComponent(r);
  g = getComponent(g);
  b = getComponent(b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

type PopupButtonProps = {
  filloutId: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  text?: string;
  color?: string;
  size?: ButtonSize;
  float?: ButtonFloat;
};

export const PopupButton = ({
  filloutId,
  inheritParameters,
  parameters,
  text,
  color = "#3b82f6",
  size = "medium",
  float,
}: PopupButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const textColor = getLuminance(color) > 0.5 ? "black" : "white";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          cursor: "pointer",
          fontFamily: "Helvetica, Arial, sans-serif",
          display: "inline-block",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textDecoration: "none",
          fontWeight: "bold",
          textAlign: "center",
          margin: 0,
          border: "medium",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          backgroundColor: color,
          color: textColor || "white",
          ...buttonSizeStyles[size],
          ...(float && buttonFloatStyles[float]),
        }}
      >
        {text || "Open form"}
      </button>

      <Popup
        filloutId={filloutId}
        inheritParameters={inheritParameters}
        parameters={parameters}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
