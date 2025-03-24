import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FormParams, useFilloutEmbed } from "../embed.js";
import { Loading } from "../components/Loading.js";
import { EventProps, useFilloutEvents } from "../events.js";

export type SliderDirection = "left" | "right";

type SliderProps = {
  filloutId: string;
  domain?: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  sliderDirection?: SliderDirection;
  isOpen: boolean;
  onClose: () => void;
} & EventProps;

// This is exposed as a standalone embed component,
// but can also be used indirectly with SliderButton
export const Slider = ({
  isOpen: _isOpen,
  onClose: _onClose,
  ...props
}: SliderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (_isOpen) setTimeout(() => setIsOpen(true), 10);
    else setIsOpen(false);
  }, [_isOpen]);

  const onClose = () => {
    if (!isOpen) return;
    setIsOpen(false);
    setTimeout(_onClose, 250);
  };

  return createPortal(
    <SliderContainer isOpen={_isOpen} isOpenAnimate={isOpen} onClose={onClose}>
      {/* _isOpen should be true from the entry animation starting to the exit animation ending */}
      {_isOpen && <SliderContent onClose={onClose} {...props} />}
    </SliderContainer>,
    document.body
  );
};

const SliderContent = ({
  filloutId,
  domain,
  inheritParameters,
  parameters,
  sliderDirection = "right",
  onClose,

  onInit,
  onPageChange,
  onSubmit,
}: Omit<SliderProps, "isOpen">) => {
  const [loading, setLoading] = useState(true);
  const embed = useFilloutEmbed({
    filloutId,
    domain,
    inheritParameters,
    parameters,
  });

  useFilloutEvents(embed, { onInit, onPageChange, onSubmit });

  const sliderLeft = sliderDirection === "left";
  const sliderOpen = !loading;

  return (
    <>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Loading />
        </div>
      )}

      <div
        className="fillout-embed-slider-main"
        style={{
          display: "flex",
          justifyContent: sliderLeft ? "start" : "end",
          flexDirection: sliderLeft ? "row" : "row-reverse",
          alignItems: "center",
          height: !loading ? "100%" : 0,
          transitionProperty: sliderLeft ? "left" : "right",
          transitionDuration: "0.25s",
          transitionTimingFunction: "ease-in-out",
          ...(sliderLeft
            ? {
                left: sliderOpen ? 0 : "-80%",
              }
            : {
                right: sliderOpen ? 0 : "-80%",
              }),
        }}
      >
        {embed && (
          <iframe
            src={embed.iframeUrl}
            allow="microphone; camera; geolocation"
            title="Embedded Form"
            className="fillout-embed-slider-iframe"
            style={{
              border: 0,
              width: !loading ? "80%" : 0,
              height: !loading ? "100%" : 0,
              opacity: !loading ? 1 : 0,
            }}
            onLoad={() => setLoading(false)}
          />
        )}

        {!loading && <CloseButton onClick={onClose} sliderLeft={sliderLeft} />}
      </div>
    </>
  );
};

const SliderContainer = ({
  children,
  isOpen,
  isOpenAnimate,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  isOpenAnimate: boolean;
  onClose: () => void;
}) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.65)",
      transition: "opacity 0.25s ease-in-out",
      zIndex: 10000000000000,
      opacity: isOpenAnimate ? 1 : 0,
      display: isOpen ? "block" : "none",
    }}
  >
    {children}
  </div>
);

const CloseButton = ({
  onClick,
  sliderLeft,
}: {
  onClick: () => void;
  sliderLeft: boolean;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="fillout-embed-slider-close"
    style={{
      border: 0,
      display: "flex",
      background: "#171717",
      color: "white",
      cursor: "pointer",
      ...(sliderLeft
        ? {
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
          }
        : {
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
          }),
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        width: 24,
        height: 24,
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);
