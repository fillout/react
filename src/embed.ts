import { useState, useEffect } from "react";

const FILLOUT_BASE_URL = "https://embed.fillout.com";

const generateEmbedId = () => {
  const min = 10000000000000;
  const max = 99999999999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return `${randomNumber}`;
};

export type FormParams = Record<string, string | undefined>;

type XOR<T1, T2> =
    (T1 & {[k in Exclude<keyof T2, keyof T1>]?: never}) |
    (T2 & {[k in Exclude<keyof T1, keyof T2>]?: never});

type FormIdentifier = XOR<{
  filloutId: string;
},{
  customFormLink: string;
}>

type CommonEmbedOptions = {
  inheritParameters?: boolean;
  parameters?: FormParams;
  dynamicResize?: boolean;
  domain?: string;
}

/**
 * Strict exclusive OR for public-facing component API.
 */
export type EmbedOptions = FormIdentifier & CommonEmbedOptions;

type NormalizeUrlParams =  {
  customFormLink?: string;
  filloutId?: string;
  origin: string;
};

const normalizeFormIdentifier = ({
  customFormLink,
  filloutId,
  origin,
}: NormalizeUrlParams): URL => {
  if (customFormLink) {
    // Accomodate full links or just the form identifier.
    try {
      return new URL(customFormLink);
    } catch {
      return new URL(customFormLink, origin);
    }
  }

  if (filloutId) {
    return new URL(`/t/${encodeURIComponent(filloutId)}`, origin);
  }

  throw new Error("Either filloutId or customFormLink must be provided.");
};

/**
 * Loose type for internal use.
 */
type EmbedHookOptions = CommonEmbedOptions & {
  customFormLink?: string;
  filloutId?: string;
}
export const useFilloutEmbed = ({
  customFormLink,
  filloutId,
  domain,
  inheritParameters,
  parameters,
  dynamicResize,
}: EmbedHookOptions) => {
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
  const iframeUrl = normalizeFormIdentifier({filloutId, origin, customFormLink});

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
