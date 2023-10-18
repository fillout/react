import React, { useState, useEffect } from "react";
import { FormParams, useFilloutEmbed } from "../embed.js";

const Loading = () => {
  return <div className="fillout-embed-loading" />;
};

type StandardProps = {
  filloutId: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  dynamicResize?: boolean;
};

export const Standard = ({
  filloutId,
  inheritParameters,
  parameters,
  dynamicResize,
}: StandardProps) => {
  const [loading, setLoading] = useState(true);
  const embed = useFilloutEmbed({
    filloutId,
    inheritParameters,
    parameters,
    dynamicResize,
  });

  // dynamic resize
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    if (dynamicResize && embed) {
      const listener = (event: MessageEvent) => {
        try {
          if (
            event.origin === new URL(embed.iframeUrl.toString()).origin &&
            event.data.embedId === embed.embedId &&
            event.data.type === "form_resized"
          ) {
            const newHeight = event.data.size;
            if (typeof newHeight === "number") {
              setHeight(newHeight);
            }
          }
        } catch (err) {}
      };

      window.addEventListener("message", listener);
      return () => window.removeEventListener("message", listener);
    }
  }, [dynamicResize, embed]);

  return (
    <div className="fillout-standard-embed" style={{ height }}>
      {loading && <Loading />}

      {embed && (
        <iframe
          src={embed.iframeUrl}
          allow="microphone; camera; geolocation"
          title="Embedded Form"
          onLoad={() => setLoading(false)}
          className="fillout-embed-iframe"
          style={{
            opacity: !loading ? 1 : 0,
            transition: dynamicResize ? "height 150ms ease" : undefined,
            borderRadius: 10,
          }}
        />
      )}
    </div>
  );
};
