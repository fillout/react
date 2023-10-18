import React, { useState } from "react";
import { FormParams, useFilloutEmbed } from "../embed.js";
import { Loading } from "../components/Loading.js";

type FullScreenProps = {
  filloutId: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
};

export const FullScreen = ({
  filloutId,
  inheritParameters,
  parameters,
}: FullScreenProps) => {
  const [loading, setLoading] = useState(true);
  const embed = useFilloutEmbed({
    filloutId,
    inheritParameters,
    parameters,
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
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

      {embed && (
        <iframe
          src={embed.iframeUrl}
          allow="microphone; camera; geolocation"
          title="Embedded Form"
          style={{
            border: 0,
            width: !loading ? "100%" : 0,
            height: !loading ? "100%" : 0,
            opacity: !loading ? 1 : 0,
          }}
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  );
};
