import React from "react";

export const Loading = () => (
  <div
    style={{
      border: "solid 2px #aaa",
      borderBottomColor: "white",
      borderRadius: "50%",
      width: 32,
      height: 32,
      animation: "fillout-embed-loading 1s infinite linear",
    }}
  ></div>
);
