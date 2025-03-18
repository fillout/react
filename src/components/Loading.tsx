import React from "react";

export const Loading = () => (
  <div>
    <div
      style={{
        color: "white",
        fontSize: 24,
        lineHeight: "24px",
        fontWeight: 600,
        marginBottom: 16,
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      Loading
    </div>

    <div
      style={{
        height: 20,
        width: 150,
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "start",
      }}
    >
      <div
        style={{
          boxShadow: "0px 5px 40px -1px #ffffffcc",
          borderRadius: 10,
          background: "white",
          height: 7,
          width: 0,
          animation: "fillout-embed-loading 1s ease forwards",
        }}
      />
    </div>
  </div>
);
