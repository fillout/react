import React, { useState } from "react";
import { FormParams, useFilloutEmbed } from "../embed.js";
import { Loading } from "../components/Loading.js";
import { useMessageListener } from "./messages.js";

type StandardProps = {
  filloutId: string;
  domain?: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  dynamicResize?: boolean;
};

export const Standard = ({
  filloutId,
  domain,
  inheritParameters,
  parameters,
  dynamicResize,
}: StandardProps) => {
  const [loading, setLoading] = useState(true);
  const embed = useFilloutEmbed({
    filloutId,
    domain,
    inheritParameters,
    parameters,
    dynamicResize,
  });

  // dynamic resize
  const [height, setHeight] = useState<number>();
  useMessageListener(
    embed,
    "form_resized",
    (data) => {
      const newHeight = data.size;
      if (typeof newHeight === "number") {
        setHeight(newHeight);
      }
    },
    { disabled: !dynamicResize }
  );

  return (
    <div
      className="fillout-standard-embed"
      style={{
        height: !dynamicResize
          ? "100%"
          : typeof height === "number"
          ? height
          : 256,
        transition: dynamicResize ? "height 150ms ease" : undefined,
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
            minHeight: 256,
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
          onLoad={() => setLoading(false)}
          style={{
            width: !loading ? "100%" : 0,
            height: !loading ? "100%" : 0,
            opacity: !loading ? 1 : 0,
            borderRadius: 10,
            border: 0,
            minHeight: 256,
          }}
        />
      )}
    </div>
  );
};
