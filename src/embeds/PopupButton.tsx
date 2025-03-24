import React, { useState } from "react";
import { FormParams } from "../embed.js";
import { Popup } from "./Popup.js";
import { Button, ButtonProps } from "../components/Button.js";
import { EventProps } from "../events.js";

type PopupButtonProps = {
  filloutId: string;
  domain?: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  width?: number | string;
  height?: number | string;
} & EventProps &
  Omit<ButtonProps, "onClick">;

export const PopupButton = ({
  filloutId,
  domain,
  inheritParameters,
  parameters,
  width,
  height,

  onInit,
  onPageChange,
  onSubmit,

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

      <Popup
        filloutId={filloutId}
        domain={domain}
        inheritParameters={inheritParameters}
        parameters={parameters}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onInit={onInit}
        onPageChange={onPageChange}
        onSubmit={onSubmit}
        width={width}
        height={height}
      />
    </>
  );
};
