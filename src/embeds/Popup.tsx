import React, { ReactNode, useState } from "react";
import { FormParams, useFilloutEmbed } from "../embed.js";
import { Loading } from "../components/Loading.js";

type PopupProps = {
  filloutId: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  onClose: () => void;
};

// This is exposed as an standalone embed component,
// but can also be used indirectly with PopupButton
export const Popup = ({
  filloutId,
  inheritParameters,
  parameters,
  onClose: _onClose,
}: PopupProps) => {
  const embed = useFilloutEmbed({
    filloutId,
    inheritParameters,
    parameters,
  });
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(true);
  const onClose = () => {
    if (!isOpen) return;
    setIsOpen(false);
    setTimeout(_onClose, 250);
  };

  return (
    <PopupContainer isOpen={isOpen} onClose={onClose}>
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
            opacity: !loading ? 1 : 0,
          }}
          onLoad={() => setLoading(false)}
        />
      )}

      {!loading && <CloseButton onClick={onClose} />}

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
    </PopupContainer>
  );
};

const PopupContainer = ({
  children,
  isOpen,
  onClose,
}: {
  children?: ReactNode;
  isOpen: boolean;
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
      padding: "40px 80px",
      boxSizing: "border-box",
      opacity: isOpen ? 1 : 0,
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

const CloseButton = ({ onClick }: { onClick: () => void }) => (
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
