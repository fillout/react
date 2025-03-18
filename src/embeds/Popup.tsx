import React, { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { FormParams, useFilloutEmbed } from "../embed.js";
import { Loading } from "../components/Loading.js";
import { EventProps, useFilloutEvents } from "../events.js";

type PopupProps = {
  filloutId: string;
  domain?: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  onClose: () => void;
  width?: number | string;
  height?: number | string;
} & EventProps;

// This is exposed as an standalone embed component,
// but can also be used indirectly with PopupButton
export const Popup = ({
  filloutId,
  domain,
  inheritParameters,
  parameters,
  onClose: _onClose,
  width,
  height,

  onInit,
  onPageChange,
  onSubmit,
}: PopupProps) => {
  const [loading, setLoading] = useState(true);
  const embed = useFilloutEmbed({
    filloutId,
    domain,
    inheritParameters,
    parameters,
  });

  useFilloutEvents(embed, { onInit, onPageChange, onSubmit });

  const [isOpen, setIsOpen] = useState(true);
  const onClose = () => {
    if (!isOpen) return;
    setIsOpen(false);
    setTimeout(_onClose, 250);
  };

  return createPortal(
    <PopupContainer
      isOpen={isOpen}
      onClose={onClose}
      width={width}
      height={height}
    >
      {!loading && <CloseButton onClick={onClose} />}

      {embed && (
        <iframe
          src={embed.iframeUrl}
          allow="microphone; camera; geolocation"
          title="Embedded Form"
          className="fillout-embed-popup-iframe"
          style={{
            border: 0,
            width: "100%",
            opacity: !loading ? 1 : 0,
          }}
          onLoad={() => setLoading(false)}
        />
      )}

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      )}
    </PopupContainer>,
    document.body
  );
};

const PopupContainer = ({
  children,
  isOpen,
  onClose,
  width,
  height,
}: {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  width?: number | string;
  height?: number | string;
}) => (
  <div
    onClick={onClose}
    className="fillout-embed-popup-container"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.65)",
      transition: "opacity 0.25s ease-in-out",
      zIndex: 10000000000000,
      boxSizing: "border-box",
      opacity: isOpen ? 1 : 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      className="fillout-embed-popup-main"
      style={{
        position: "relative",
        width: width || "100%",
        height: height || "100%",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {children}
    </div>
  </div>
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="fillout-embed-popup-close"
    style={{
      width: 24,
      height: 24,
      textAlign: "center",
      cursor: "pointer",
      transition: "opacity 0.5s ease-in-out",
      textDecoration: "none",
      color: "white",
      borderRadius: "50%",
      padding: 6,
      boxSizing: "content-box",
      border: 0,
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);
