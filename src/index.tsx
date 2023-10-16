import React, { useState, useEffect } from "react";

const FILLOUT_BASE_URL = "https://forms.fillout.com/t/";

const Loading = () => {
  return <div className="fillout-embed-loading" />;
};

const generateEmbedId = () => {
  const min = 10000000000000;
  const max = 99999999999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${randomNumber}`;
};

type StandardProps = {
  filloutId: string;
  parameters?: Record<string, string | undefined>;
  inheritParameters?: boolean;
  dynamicResize?: boolean;
};

export const FilloutStandardEmbed = ({
  filloutId,
  parameters,
  inheritParameters,
  dynamicResize,
}: StandardProps) => {
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const [embedId, setEmbedId] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
    setEmbedId(generateEmbedId());
  }, []);

  // iframe url
  const iframeUrl = new URL(FILLOUT_BASE_URL + encodeURIComponent(filloutId));

  // inherit query params
  if (inheritParameters && searchParams) {
    for (const [key, value] of searchParams.entries()) {
      iframeUrl.searchParams.set(key, value);
    }
  }

  // parameters prop
  if (parameters) {
    for (const [key, value] of Object.entries(parameters)) {
      if (value) iframeUrl.searchParams.set(key, value);
    }
  }

  // misc query params
  if (embedId) iframeUrl.searchParams.set("fillout-embed-id", embedId);
  if (dynamicResize) {
    iframeUrl.searchParams.set("fillout-embed-dynamic-resize", "true");
  }

  // dynamic resize
  const [height, setHeight] = useState<number>(400);
  useEffect(() => {
    if (dynamicResize && embedId) {
      const listener = (event: MessageEvent) => {
        try {
          if (
            event.origin === new URL(iframeUrl.toString()).origin &&
            event.data.embedId === embedId &&
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
  }, [dynamicResize, embedId]);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {loading && <Loading />}

      {embedId && (
        <iframe
          src={iframeUrl.toString()}
          allow="microphone; camera; geolocation"
          title="Embedded Form"
          onLoad={() => setLoading(false)}
          className="fillout-embed-iframe"
          style={{
            opacity: !loading ? 1 : 0,
            height,
            transition: dynamicResize ? "height 150ms ease" : undefined,
          }}
        />
      )}
    </div>
  );
};
