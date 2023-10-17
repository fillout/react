import React from "react";

export const Loading = () => (
  <div
    style={{
      border: "6px solid #aaa",
      borderRadius: "50%",
      borderTop: "6px solid #fff",
      width: 20,
      height: 20,
      animation: "fillout-embed-loading-spin 2s linear infinite",
      WebkitAnimation: "fillout-embed-loading-spin 2s linear infinite", // Safari

      // Important - e.g. Webflow applies a box sizing that messes this up
      boxSizing: "content-box",
    }}
  />
);
