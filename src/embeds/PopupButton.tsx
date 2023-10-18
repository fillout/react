import React, { useState } from "react";
import { FormParams } from "../embed.js";
import { Popup } from "./Popup.js";
import { Button, ButtonProps } from "../components/Button.js";

type PopupButtonProps = {
  filloutId: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
} & Omit<ButtonProps, "onClick">;

export const PopupButton = ({
  filloutId,
  inheritParameters,
  parameters,
  text,
  color,
  size,
  float,
}: PopupButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        text={text}
        color={color}
        size={size}
        float={float}
      />

      {isOpen && (
        <Popup
          filloutId={filloutId}
          inheritParameters={inheritParameters}
          parameters={parameters}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
