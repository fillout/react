import { useEffect } from "react";
import { EmbedType } from "../embed.js";

export const useMessageListener = (
  embed: EmbedType | undefined,
  eventName: string,
  fn: (data: any) => void,
  options?: { disabled?: boolean }
) => {
  const enabled = !options?.disabled;

  useEffect(() => {
    if (embed && enabled) {
      const listener = (event: MessageEvent) => {
        try {
          if (
            event.origin === embed.origin &&
            event.data.embedId === embed.embedId &&
            event.data.type === eventName
          ) {
            if (location.href.includes("FILLOUT_EMBED_DEBUG")) {
              console.log(["fillout embed", eventName, event.data]);
            }

            fn(event.data);
          }
        } catch (err) {}
      };

      window.addEventListener("message", listener);
      return () => window.removeEventListener("message", listener);
    }
  }, [embed, eventName, fn, enabled]);
};
