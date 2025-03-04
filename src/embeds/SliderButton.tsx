import React, { useState } from "react";
import { FormParams } from "../embed.js";
import { Slider, SliderDirection } from "./Slider.js";
import { Button, ButtonProps } from "../components/Button.js";
import { EventProps } from "../events.js";

type SliderButtonProps = {
  filloutId: string;
  domain?: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  sliderDirection?: SliderDirection;
} & EventProps &
  Omit<ButtonProps, "onClick">;

export const SliderButton = ({
  filloutId,
  domain,
  inheritParameters,
  parameters,
  sliderDirection,

  onInit,
  onPageChange,
  onSubmit,

  text,
  color,
  size,
  float,
}: SliderButtonProps) => {
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
        <Slider
          filloutId={filloutId}
          domain={domain}
          inheritParameters={inheritParameters}
          parameters={parameters}
          sliderDirection={sliderDirection}
          onClose={() => setIsOpen(false)}
          onInit={onInit}
          onPageChange={onPageChange}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};
