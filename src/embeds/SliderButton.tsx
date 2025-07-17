import React, { useState } from "react";
import { EmbedOptions, FormParams } from "../embed.js";
import { Slider, SliderDirection } from "./Slider.js";
import { Button, ButtonProps } from "../components/Button.js";
import { EventProps } from "../events.js";

type SliderButtonProps = EmbedOptions & {
  sliderDirection?: SliderDirection;
} & EventProps &
  Omit<ButtonProps, "onClick">;

export const SliderButton = ({

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
  dynamicResize,
  ...embedIdentifiers
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

      <Slider
        {...embedIdentifiers}
        domain={domain}
        inheritParameters={inheritParameters}
        parameters={parameters}
        sliderDirection={sliderDirection}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onInit={onInit}
        onPageChange={onPageChange}
        onSubmit={onSubmit}
      />
    </>
  );
};
