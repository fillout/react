import React, { useState } from "react";
import { FormParams } from "../embed.js";
import { Slider, SliderDirection } from "./Slider.js";
import { Button, ButtonProps } from "../components/Button.js";

type SliderButtonProps = {
  filloutId: string;
  domain?: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  sliderDirection?: SliderDirection;
} & Omit<ButtonProps, "onClick">;

export const SliderButton = ({
  filloutId,
  domain,
  inheritParameters,
  parameters,
  sliderDirection,
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
        />
      )}
    </>
  );
};
