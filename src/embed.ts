import { useState, useEffect } from "react";

const DEFAULT_BASE_URL = "https://embed.fillout.com";

const getBaseUrl = (): string =>
  (typeof window !== "undefined" && (window as Record<string, unknown>)._filloutEmbedUrl as string) ||
  DEFAULT_BASE_URL;

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
  const isLocalhost =
    domain === "localhost" || domain?.startsWith("localhost:");
  const origin = domain
    ? domain.startsWith("http://") || domain.startsWith("https://")
      ? domain
      : isLocalhost
      ? `http://${domain}`
      : `https://${domain}`
    : getBaseUrl();
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
