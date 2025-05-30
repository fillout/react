import { useState, useEffect } from "react";

const FILLOUT_BASE_URL = "https://embed.fillout.com";

const generateEmbedId = () => {
  const min = 10000000000000;
  const max = 99999999999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${randomNumber}`;
};

export type FormParams = Record<string, string | undefined>;

type EmbedOptions = {
  filloutId: string;
  domain?: string;
  inheritParameters?: boolean;
  parameters?: FormParams;
  dynamicResize?: boolean;
};

export const useFilloutEmbed = ({
  filloutId,
  domain,
  inheritParameters,
  parameters,
  dynamicResize,
}: EmbedOptions) => {
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const [embedId, setEmbedId] = useState<string>();

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
    setEmbedId(generateEmbedId());
  }, []);

  // must run on client
  if (!searchParams || !embedId) return;

  // iframe url
  const origin = domain ? `https://${domain}` : FILLOUT_BASE_URL;
  const iframeUrl = new URL(`${origin}/t/${encodeURIComponent(filloutId)}`);

  // inherit query params
  if (inheritParameters && searchParams) {
    for (const [key, value] of searchParams.entries()) {
      iframeUrl.searchParams.set(key, value);
    }
  }

  // additional params
  if (parameters) {
    for (const [key, value] of Object.entries(parameters)) {
      if (value) iframeUrl.searchParams.set(key, value);
    }
  }

  // misc query params
  iframeUrl.searchParams.set("fillout-embed-id", embedId);
  if (dynamicResize) {
    iframeUrl.searchParams.set("fillout-embed-dynamic-resize", "true");
  }

  return {
    iframeUrl: iframeUrl.toString(),
    origin,
    embedId,
  };
};

export type EmbedType = Exclude<ReturnType<typeof useFilloutEmbed>, undefined>;
