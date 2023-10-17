import React, { ReactNode } from "react";
import { FormParams, useFilloutEmbed } from "./embed.js";

type PopupProps = {
  flowId: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
};

export const Popup = ({
  flowId,
  inheritParameters,
  parameters,
}: PopupProps) => {
  const embed = useFilloutEmbed({ flowId, inheritParameters, parameters });
  const onClose = () => alert("close");

  return (
    <PopupContainer onClose={onClose}>
      {embed && (
        <iframe
          src={embed.iframeUrl}
          allow="microphone; camera; geolocation"
          title="Embedded Form"
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            borderRadius: 10,
          }}
        />
      )}

      <CloseButton onClick={onClose} />
    </PopupContainer>
  );
};

const PopupContainer = ({
  children,
  onClose,
}: {
  children?: ReactNode;
  onClose?: () => void;
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
      padding: "40px 80px",
      boxSizing: "border-box",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  </div>
);

const CloseButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      width: 24,
      height: 24,
      textAlign: "center",
      cursor: "pointer",
      transition: "opacity 0.5s ease-in-out",
      textDecoration: "none",
      color: "white",
      top: -15,
      right: -15,
      background: "#171717",
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
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);
